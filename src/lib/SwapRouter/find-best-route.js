const Dexes = require("./Dexes");
const { percentToDecimal } = require("./utils");
const { Combination } = require("js-combinatorics");
const _ = require("lodash");
// eslint-disable-next-line no-unused-vars
const { default: BigNumber } = require("bignumber.js");
// throws verbose errors for better developer experience

const validateSlippageToleranceInput = (route, slippageTolerance) => {
  if (!Array.isArray(route.trades)) {
    throw new Error("expected routes.trades to be an array");
  }
  if (route.trades.length === 0) {
    throw new Error("route.trades must have length greater than zero");
  }
  if (isNaN(slippageTolerance)) {
    throw new Error(
      `expected slippageTolerance to be a number, but got ${typeof slippageTolerance}`
    );
  }
};

// throws verbose errors for better dev experience
const validateFindBestRouteInput = (inputAmount, routePairCombos) => {
  if (typeof inputAmount !== "number") {
    throw new Error(
      `Expected inputAmount to be of type 'number', but got ${typeof inputAmount}`
    );
  }
  if (!Array.isArray(routePairCombos)) {
    throw new Error("Expected route pair combos to be an array");
  }
};

const getAllSwapPaths = (
  inputAssetSlug,
  outputAssetSlug,
  pairList,
  depth = 1,
  path = [],
  allPaths = []
) => {
  for (var i = 0; i < pairList.length; i++) {
    console.log(pairList)
    const pair = pairList[i];
    if (pair.a.assetSlug !== inputAssetSlug) {
      continue;
    }
    if (depth === 1 && pair.b.assetSlug === outputAssetSlug) {
      allPaths.push([].concat(path, [pair]));
    } else if (depth > 1 && pairList.length > 1) {
      const pairsExcludingThisPair = pairList
        .slice(0, i)
        .concat(pairList.slice(i + 1, pairList.length));

      getAllSwapPaths(
        pair.b.assetSlug,
        outputAssetSlug,
        pairsExcludingThisPair,
        depth - 1,
        [].concat(path, [pair]),
        allPaths
      );
    }
  }
  return allPaths;
};
const MAX_DEPTH = 3;
// asset slugs must be unique to each token, for example `tokenAddres_tokenId`
// pairlist must be an array of SwapPairs.  see ./teztools-data-parser.js for an example
const getAllCombinations = (inputAssetSlug, outputAssetSlug, routePairs) => {
  let toRet = [];
  for (var i = 1; i <= MAX_DEPTH; i++) {
    toRet = toRet.concat(
      toRet,
      getAllSwapPaths(inputAssetSlug, outputAssetSlug, routePairs, i)
    );
  }

  toRet = toRet.filter(
    (hops) => _.uniqBy(hops, "dexAddress").length === hops.length
  );

  const combos = new Map();
  for (const route of toRet) {
    combos.set(
      route.reduce(
        (s, hop) =>
          `${s}_${hop.a.assetSlug}_${hop.b.assetSlug}_${hop.dexAddress}`,
        "route"
      ),
      route
    );
  }

  return [...combos.values()];
};

const getDexOutput = (input, pair) => {
  const Dex = Dexes[pair.dex];
  if (Dex) {
    return Dex.getSwapOutput(input, pair);
  } else {
    throw new Error(`Unknown Dex: ${pair.dex}`);
  }
};

const getOutputOfTrade = (
  input,
  pairs,
  index = 0,
  trades = [],
  slippageTolerance = 1
) => {
  const output = getDexOutput(input, pairs[index]);
  const minOut = getDexOutput(input, pairs[index]) * slippageTolerance;
  if (output === 0 || (isNaN(output) && !output.toString().includes("e"))) {
    return { trades: [], outputAmount: 0 };
  }
  const toAppend = {
    ...pairs[index],
    output,
    minOut,
    input,
  };
  const newTrades = [].concat(trades, toAppend);
  if (index < pairs.length - 1) {
    return getOutputOfTrade(
      minOut,
      pairs,
      index + 1,
      newTrades,
      slippageTolerance
    );
  }

  return { trades: newTrades, outputAmount: output, minOut };
};

const getOutputOfWeightedTrade = (
  input,
  pairs,
  index = 0,
  trades = [],
  slippageTolerance = 1
) => {
  const totalWeight = pairs.reduce((a, pair) => a + pair[0].a.pool, 0);

  let outputAmount = 0;
  let minOutAmount = 0;
  for (const pair of pairs) {
    const weightedInput = input * (pair[0].a.pool / totalWeight);

    // const slippagePerTrade =
    //   percentToDecimal(slippageTolerance) ** (slippageTolerance / pair.length);
    const {
      trades: pairTrades,
      outputAmount: hopOutput,
      minOut: hopMinOut,
    } = {
      ...getOutputOfTrade(weightedInput, pair, 0, [], slippageTolerance),
    };

    if (pairTrades.length === 0) {
      return { trades: [], outputAmount: 0, minOutAmount: 0 };
    }

    pairTrades[0].weight = pair[0].a.pool / totalWeight;
    trades.push(pairTrades);
    outputAmount += hopOutput;
    minOutAmount += hopMinOut;
  }

  return { trades, outputAmount, minOutAmount };
};

const addSlippageToleranceToRoute = (route, slippageTolerance) => {
  validateSlippageToleranceInput(route, slippageTolerance);
  const slippagePerTrade =
    percentToDecimal(slippageTolerance) ** (1 / route.trades.length);
  const { trades } = getOutputOfTrade(
    route.inputAmount,
    [...route.trades],
    0,
    [],
    slippagePerTrade
  );
  return Object.freeze({
    ...route,
    slippageTrades: trades,
    outputWithSlippage: _.last(trades).minOut,
  });
};

const addSlippageToleranceToWeightedRoute = (route, slippageTolerance) => {
  validateSlippageToleranceInput(route, slippageTolerance);
  const slippagePerTrade =
    percentToDecimal(slippageTolerance) ** (1 / route.trades.length);
  const { trades, minOutAmount } = getOutputOfWeightedTrade(
    route.inputAmount,
    [...route.trades],
    0,
    [],
    slippagePerTrade
  );
  return Object.freeze({
    ...route,
    slippageTrades: trades,
    outputWithSlippage: minOutAmount,
  });
};

const findBestRoute = (
  inputAmount,
  routePairCombos,
  slippageTolerance,
  routingFee
) => {
  inputAmount = parseFloat(inputAmount);
  validateFindBestRouteInput(inputAmount, routePairCombos);
  let bestRoute = { inputAmount, type: "linear" };
  for (var i = 0; i < routePairCombos.length; i++) {
    const slippagePerTrade =
      percentToDecimal(slippageTolerance) ** (1 / routePairCombos[i].length);
    var tradeinput = inputAmount;
    if (routePairCombos[i].length > 1) {
      if (routePairCombos[i][0].a.decimals !== 0 && routingFee) {
        tradeinput = tradeinput * routingFee;
      }
    }
    const { trades, outputAmount } = {
      ...getOutputOfTrade(
        tradeinput,
        routePairCombos[i],
        0,
        [],
        slippagePerTrade
      ),
    };
    if (bestRoute.outputAmount === undefined) {
      bestRoute = {
        ...bestRoute,
        inputAmount: tradeinput,
        outputAmount,
        trades,
      };
    }
    // console.log(bestRoute);
    if (outputAmount > bestRoute.outputAmount) {
      bestRoute = {
        ...bestRoute,
        inputAmount: tradeinput,
        outputAmount,
        trades: [...trades],
      };
    }
  }
  return { ...bestRoute };
};

const findTopRoutes = (inputAmount, routePairCombos, slippageTolerance) => {
  inputAmount = parseFloat(inputAmount);
  validateFindBestRouteInput(inputAmount, routePairCombos);
  const routes = [];
  for (var i = 0; i < routePairCombos.length; i++) {
    const slippagePerTrade =
      percentToDecimal(slippageTolerance) ** (1 / routePairCombos[i].length);
    const { trades, outputAmount } = {
      ...getOutputOfTrade(
        inputAmount,
        routePairCombos[i],
        0,
        [],
        slippagePerTrade
      ),
    };

    routes.push({
      inputAmount,
      outputAmount,
      trades,
      combo: routePairCombos[i],
    });
  }
  return _.orderBy(routes, ["outputAmount"], ["desc"]).slice(0, 20);
};

const findBestWeightedRoute = (inputAmount, weightedPairs) => {
  let bestRoute = { inputAmount, type: "weighted" };
  let weightedPairCombos = [...new Combination(weightedPairs, 2)];

  if (weightedPairCombos.length > 2 && MAX_DEPTH > 2) {
    weightedPairCombos = weightedPairCombos.concat([
      ...new Combination(weightedPairs, 3),
      // ...new Combination(weightedPairs, 4),
    ]);
  }

  for (const weightedPair of weightedPairCombos) {
    // pools must only exist in the whole route 1 time
    const check = new Set();
    let totalHops = 0;
    for (const combo of weightedPair) {
      for (const hop of combo) {
        const slugs = [hop.a.assetSlug, hop.b.assetSlug];
        slugs.sort();
        check.add(`${slugs.join("_")}_${hop.dexAddress}`);
        totalHops++;
      }
    }

    if (totalHops > check.size) {
      continue;
    }

    const weightedTradeOutput = getOutputOfWeightedTrade(
      inputAmount,
      weightedPair,
      0,
      [],
      1
    );

    if (bestRoute.outputAmount === undefined) {
      bestRoute = weightedTradeOutput;
    }

    if (weightedTradeOutput.outputAmount > bestRoute.outputAmount) {
      bestRoute = weightedTradeOutput;
    }
  }

  return { ...bestRoute, inputAmount, type: "weighted" };
};

module.exports = {
  getAllCombinations,
  getOutputOfTrade,
  getOutputOfWeightedTrade,
  findBestRoute,
  findTopRoutes,
  findBestWeightedRoute,
  addSlippageToleranceToRoute,
  addSlippageToleranceToWeightedRoute,
};
