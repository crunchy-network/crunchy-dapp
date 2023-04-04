import { pascalCase } from "change-case";
import BigNumber from "bignumber.js";
import config from "./../config";

const isPoolBelowMinThreshold = (mutez) => {
  return BigNumber(mutez).lt(config.minPoolSize);
};

const shouldSkip = (dex) => {
  for (const pool of dex.pools) {
    if (config.excludedTokens.includes(pool.token.symbol)) {
      return true;
    }

    if (
      ["XTZ", "WTZ"].includes(pool.token.symbol) &&
      isPoolBelowMinThreshold(pool.reserves)
    ) {
      return true;
    }
  }

  return false;
};

const getDexName = (dexType) => {
  if (dexType === "sirius") {
    return "LiquidityBaking";
  }

  if (dexType === "wtz") {
    return "WTZ";
  }

  if (dexType === "plenty_ctez") {
    return "PlentyCtezTez";
  }

  if (dexType === "quipuswap_token2token") {
    return "QuipuswapTokenToTokenDex";
  }

  return pascalCase(dexType);
};

const getParamValue = (params, paramName, defaultValue = 0) => {
  const param = params.find((p) => p.name === paramName);
  return param ? param.value : defaultValue;
};

const createSimplePairSide = (pool) => {
  return {
    tokenId: pool.token_id,
    tokenAddress: pool.token_address,
    decimals: pool.token.decimals,
    contractType: pool.token.token_type,
    tokenSymbol: pool.token.symbol,
    pool: BigNumber(pool.reserves)
      .div(BigNumber(10).pow(pool.token.decimals))
      .toNumber(),
    assetSlug:
      pool.token_address === "tez"
        ? "tez"
        : `${pool.token_address}_${pool.token_id}`,
  };
};

const buildSimplePair = (dex, baseToken = "tez", inverted = false) => {
  const baseAddress = config.addresses[baseToken] || baseToken;
  let aSide = inverted
    ? dex.pools.find((p) => p.token_address === baseAddress)
    : dex.pools.find((p) => p.token_address !== baseAddress);
  let bSide = inverted
    ? dex.pools.find((p) => p.token_address !== baseAddress)
    : dex.pools.find((p) => p.token_address === baseAddress);

  if (!aSide || !bSide) {
    aSide = dex.pools[inverted ? 1 : 0];
    bSide = dex.pools[inverted ? 0 : 1];
  }

  return {
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    a: createSimplePairSide(aSide),
    b: createSimplePairSide(bSide),
  };
};

const buildYouvesPair = (dex, inverted = false) => {
  let aSide = inverted
    ? dex.pools.find((p) =>
        config.dexes.youves.cashTokens.includes(p.token.symbol)
      )
    : dex.pools.find(
        (p) => !config.dexes.youves.cashTokens.includes(p.token.symbol)
      );
  let bSide = inverted
    ? dex.pools.find(
        (p) => !config.dexes.youves.cashTokens.includes(p.token.symbol)
      )
    : dex.pools.find((p) =>
        config.dexes.youves.cashTokens.includes(p.token.symbol)
      );

  if (!aSide || !bSide) {
    aSide = dex.pools[inverted ? 1 : 0];
    bSide = dex.pools[inverted ? 0 : 1];
  }

  return {
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    a: { ...createSimplePairSide(aSide), cash: inverted },
    b: { ...createSimplePairSide(bSide), cash: !inverted },
  };
};

const buildPlentyStablePair = (dex, inverted = false) => {
  const aSide = dex.pools[inverted ? 1 : 0];
  const bSide = dex.pools[inverted ? 0 : 1];

  return {
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    a: {
      ...createSimplePairSide(aSide),
      precision: getParamValue(aSide.params, "precision"),
    },
    b: {
      ...createSimplePairSide(bSide),
      precision: getParamValue(bSide.params, "precision"),
    },
  };
};

const buildQuipuStablePair = (dex, token1Pool, token2Pool) => {
  const poolParams = [];
  for (const pool of dex.pools) {
    const i = getParamValue(pool.params, "index", false);
    if (i === false) {
      return false;
    }
    poolParams[parseInt(i)] = {
      reserves: BigNumber(pool.reserves),
      precision: BigNumber(getParamValue(pool.params, "precision_multiplier")),
      rate: BigNumber(getParamValue(pool.params, "rate")),
    };
  }

  return {
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: "Direct",
    fee: {
      liquidityProvidersFee: BigNumber(getParamValue(dex.params, "lp_fee")),
      stakersFee: BigNumber(getParamValue(dex.params, "stakers_fee")),
      interfaceFee: BigNumber(getParamValue(dex.params, "ref_fee")),
      devFee: BigNumber(4500000),
    },
    poolId: parseInt(getParamValue(dex.params, "pool_id")),
    poolParams: poolParams,
    initialA: BigNumber(getParamValue(dex.params, "initial_A")),
    initialATime: getParamValue(dex.params, "initial_A_time"),
    futureA: BigNumber(getParamValue(dex.params, "future_A")),
    futureATime: getParamValue(dex.params, "future_A_time"),
    a: {
      ...createSimplePairSide(token1Pool),
      index: parseInt(getParamValue(token1Pool.params, "index")),
    },
    b: {
      ...createSimplePairSide(token2Pool),
      index: parseInt(getParamValue(token2Pool.params, "index")),
    },
  };
};

const buildQuipuToken2TokenPair = (dex, inverted = false) => {
  const aSide = dex.pools[inverted ? 1 : 0];
  const bSide = dex.pools[inverted ? 0 : 1];

  return {
    poolId: aSide.pool_id,
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    a: {
      ...createSimplePairSide(aSide),
      precision: getParamValue(aSide.params, "precision"),
    },
    b: {
      ...createSimplePairSide(bSide),
      precision: getParamValue(bSide.params, "precision"),
    },
  };
};

const buildQuipuStablePairs = (dex) => {
  const pairs = [];
  for (let t1 = 0; t1 < dex.pools.length; t1++) {
    const token1 = dex.pools[t1];
    for (var t2 = 0; t2 < dex.pools.length; t2++) {
      if (t2 === t1) {
        continue;
      }
      const token2 = dex.pools[t2];
      const p = buildQuipuStablePair(dex, token1, token2);
      if (p) {
        pairs.push(p);
      }
    }
  }
  return pairs;
};


const modifyQuipuSwapToken2TokenPair = (dex) => {
  const removedPoolIds = [];
  const modifiedPools = dex.pools.filter(function (el) {
    if (removedPoolIds.includes(el.pool_id)) {
      return false;
    }
    if (config.excludedTokens.includes(el.token.symbol)) {
      removedPoolIds.push(el.pool_id);
      return false;
    }
    return true;
  });
  const { pools, ...rest } = dex;
  rest.pools = modifiedPools;
  return rest;
};

const buildSwapPairs = (dexes) => {
  let pairs = [];

  for (let dex of dexes) {
    if (dex.dex_type === "quipuswap_token2token") {
      dex = modifyQuipuSwapToken2TokenPair(dex);
    }

    if (shouldSkip(dex)) {
      continue;
    }

    switch (dex.dex_type) {
      case "quipuswap":
      case "vortex":
      case "sirius":
      case "plenty":
        pairs.push(buildSimplePair(dex, "tez"));
        pairs.push(buildSimplePair(dex, "tez", true));
        break;

      case "spicy":
        pairs.push({
          ...buildSimplePair(dex, "wtz"),
          dexAddress: config.dexes.spicy.dexRouter,
        });
        pairs.push({
          ...buildSimplePair(dex, "wtz", true),
          dexAddress: config.dexes.spicy.dexRouter,
        });
        break;

      case "youves":
        pairs.push(buildYouvesPair(dex));
        pairs.push(buildYouvesPair(dex, true));
        break;

      case "plenty_stable":
        pairs.push(buildPlentyStablePair(dex));
        pairs.push(buildPlentyStablePair(dex, true));
        break;

      case "quipuswap_token2token":
        pairs.push(buildQuipuToken2TokenPair(dex));
        pairs.push(buildQuipuToken2TokenPair(dex, true));
        break;

      case "quipuswap_stable":
        pairs = pairs.concat(buildQuipuStablePairs(dex));
        break;

      case "plenty_ctez": {
        const ctezParams = {
          target: BigNumber(
            dex.params.find((p) => p.name === "target").value
          ).toNumber(),
        };
        pairs.push({ ...buildSimplePair(dex, "tez"), ...ctezParams });
        pairs.push({ ...buildSimplePair(dex, "tez", true), ...ctezParams });
        break;
      }

      case "wtz": {
        const wtzParams = {
          swapRatio: BigNumber(
            dex.params.find((p) => p.name === "swap_ratio").value
          ).toNumber(),
          swapRatioPrecision: BigNumber(
            dex.params.find((p) => p.name === "swap_ratio_precision").value
          ).toNumber(),
        };
        pairs.push({
          ...buildSimplePair(dex, "tez"),
          ...wtzParams,
        });
        pairs.push({
          ...buildSimplePair(dex, "tez", true),
          ...wtzParams,
        });
        break;
      }
    }
  }

  return pairs;
};

export { buildSwapPairs };
