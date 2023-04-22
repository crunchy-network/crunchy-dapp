import { pascalCase } from "change-case";
import BigNumber from "bignumber.js";
import config from "./../config";
import tzkt from "../../../utils/tzkt";

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

  if (dexType === "quipuswap_v2") {
    return "QuipuswapV2";
  }

  if (dexType === "quipuswap_v3") {
    return "QuipuswapV3";
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

const buildQuipuToken2TokenPair = (
  dex,
  token1Pool,
  token2Pool,
  inverted = false
) => {
  return {
    poolId: token1Pool.pool_id,
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    a: {
      ...createSimplePairSide(token1Pool),
    },
    b: {
      ...createSimplePairSide(token2Pool),
    },
  };
};

const buildQuipuV2Pair = (dex, token1Pool, token2Pool, inverted = false) => {
  return {
    poolId: token1Pool.pool_id,
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    fee: {
      interfaceFee: BigNumber(getParamValue(dex.params, "interface_fee")),
      swapFee: BigNumber(getParamValue(dex.params, "swap_fee")),
      auctionFee: BigNumber(getParamValue(dex.params, "auction_fee")),
      withdrawFeeReward: BigNumber(
        getParamValue(dex.params, "withdraw_fee_reward")
      ),
    },
    a: {
      ...createSimplePairSide(token1Pool),
      token_a_price_cml: inverted
        ? getParamValue(token2Pool.params, "token_b_price_cml")
        : getParamValue(token1Pool.params, "token_a_price_cml"),
    },
    b: {
      ...createSimplePairSide(token2Pool),
      token_b_price_cml: inverted
        ? getParamValue(token1Pool.params, "token_a_price_cml")
        : getParamValue(token2Pool.params, "token_b_price_cml"),
    },
  };
};

const buildFlamePair = (dex, token1Pool, token2Pool, inverted = false) => {
  return {
    poolId: token1Pool.pool_id,
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    fee: getParamValue(token1Pool.params, "fee"),
    lastRewardPerTez: getParamValue(token1Pool.params, "last_reward_per_tez"),
    rewardPerShare: getParamValue(token1Pool.params, "reward_per_share"),
    a: {
      ...createSimplePairSide(token1Pool),
      totalSupply: getParamValue(token1Pool.params, "total_supply"),
    },
    b: {
      ...createSimplePairSide(token2Pool),
      totalSupply: getParamValue(token1Pool.params, "total_supply"),
    },
  };
};

const buildQuipuV2Pairs = (dex) => {
  const pairs = [];
  const poolIds = [];
  for (let t1 = 0; t1 < dex.pools.length; t1++) {
    let p = null;
    const token1 = dex.pools[t1];
    const token2 = dex.pools.filter(
      (el) => el.pool_id === token1.pool_id && el.reserves !== token1.reserves
    )[0];
    if (poolIds.includes(token1.pool_id)) {
      p = buildQuipuV2Pair(dex, token1, token2, true);
    } else {
      p = buildQuipuV2Pair(dex, token1, token2);
      poolIds.push(token1.pool_id);
    }
    if (p) {
      pairs.push(p);
    }
  }
  return pairs;
};

const getModifiedTicks = async (ticksKey) => {
  const ticks = (await tzkt.getBigMapKeys(ticksKey)).data;
  return ticks.map((item) => ({ [item.key]: item.value }));
};
const buildQuipuV3Pairs = async (dex, inverted = false) => {
  const aSide = dex.pools[inverted ? 1 : 0];
  const bSide = dex.pools[inverted ? 0 : 1];

  const ticks = getParamValue(dex.params, "ticks")
    .replace(/[/\\]/g, "")
    .replace(/^\{"/, "[")
    .replace(/"\}$/, "]")
    .replace(/",{"/g, ',{');

  // const modifiedTicks = JSON.parse(ticks)
  console.log(ticks);
  // const modifiedTicks = await getModifiedTicks(ticksKey);

  return {
    poolId: aSide.pool_id,
    dex: getDexName(dex.dex_type),
    dexAddress: dex.dex_address,
    direction: inverted ? "Inverted" : "Direct",
    fee: {
      feeBps: getParamValue(dex.params, "fee_bps").replace(/^"(.*)"$/, "$1"),
      devFeeA: inverted
        ? getParamValue(bSide.params, "dev_fee_B")
        : getParamValue(aSide.params, "dev_fee_A"),
      feeGrowthA: inverted
        ? getParamValue(bSide.params, "fee_growth_B")
        : getParamValue(aSide.params, "fee_growth_A"),
      devFeeB: inverted
        ? getParamValue(aSide.params, "dev_fee_A")
        : getParamValue(bSide.params, "dev_fee_B"),
      feeGrowthB: inverted
        ? getParamValue(bSide.params, "fee_growth_A")
        : getParamValue(aSide.params, "fee_growth_B"),
    },
    ticks: modifiedTicks,
    lastCumulativesBuffer: getParamValue(dex.params, "last_cumulatives_buffer"),
    curTickIndex: getParamValue(dex.params, "cur_tick_index").replace(
      /^"(.*)"$/,
      "$1"
    ),
    curTickWitness: getParamValue(dex.params, "cur_tick_witness").replace(
      /^"(.*)"$/,
      "$1"
    ),
    liquidity: getParamValue(dex.params, "liquidity").replace(/^"(.*)"$/, "$1"),
    factoryAddress: getParamValue(dex.params, "factory_address"),
    sqrtPrice: getParamValue(dex.params, "sqrt_price").replace(
      /^"(.*)"$/,
      "$1"
    ),
    a: {
      ...createSimplePairSide(aSide),
      devFeeA: inverted
        ? getParamValue(bSide.params, "dev_fee_B")
        : getParamValue(aSide.params, "dev_fee_A"),
      feeGrowthA: inverted
        ? getParamValue(bSide.params, "fee_growth_B")
        : getParamValue(aSide.params, "fee_growth_A"),
    },
    b: {
      ...createSimplePairSide(bSide),
      devFeeB: inverted
        ? getParamValue(aSide.params, "dev_fee_A")
        : getParamValue(bSide.params, "dev_fee_B"),
      feeGrowthB: inverted
        ? getParamValue(bSide.params, "fee_growth_A")
        : getParamValue(aSide.params, "fee_growth_B"),
    },
  };
};

const buildQuipuToken2TokenPairs = (dex) => {
  const pairs = [];
  const poolIds = [];
  for (let t1 = 0; t1 < dex.pools.length; t1++) {
    let p = null;
    const token1 = dex.pools[t1];
    const token2 = dex.pools.filter(
      (el) => el.pool_id === token1.pool_id && el.reserves !== token1.reserves
    )[0];

    if (poolIds.includes(token1.pool_id)) {
      p = buildQuipuToken2TokenPair(dex, token1, token2, true);
    } else {
      p = buildQuipuToken2TokenPair(dex, token1, token2);
      poolIds.push(token1.pool_id);
    }
    if (p) {
      pairs.push(p);
    }
  }
  return pairs;
};

const buildFlamePairs = (dex) => {
  const pairs = [];
  const poolIds = [];
  for (let t1 = 0; t1 < dex.pools.length; t1++) {
    let p = null;
    const token1 = dex.pools[t1];
    const token2 = dex.pools.filter(
      (el) => el.pool_id === token1.pool_id && el.reserves !== token1.reserves
    )[0];

    if (poolIds.includes(token1.pool_id)) {
      p = buildFlamePair(dex, token1, token2, true);
    } else {
      p = buildFlamePair(dex, token1, token2);
      poolIds.push(token1.pool_id);
    }
    if (p) {
      pairs.push(p);
    }
  }
  return pairs;
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

const modifyMasterDex = (dex) => {
  const removedPoolIds = [];
  for (let i = 0; i < dex.pools.length; i++) {
    const pool = dex.pools[i];
    if (config.excludedTokens.includes(pool.token.symbol)) {
      removedPoolIds.push(pool.pool_id);
      continue;
    }

    if (
      ["XTZ", "WTZ"].includes(pool.token.symbol) &&
      isPoolBelowMinThreshold(pool.reserves)
    ) {
      removedPoolIds.push(pool.pool_id);
    }
  }

  const modifiedPools = dex.pools.filter(function (el) {
    if (removedPoolIds.includes(el.pool_id)) {
      return false;
    }
    return true;
  });

  const { pools, ...rest } = dex;
  rest.pools = modifiedPools;
  return rest;
};

const buildSwapPairs = async (dexes) => {
  let pairs = [];
  const masterDex = ["quipuswap_token2token", "quipuswap_v2", "flame", "alien"];
  for (let dex of dexes) {
    if (masterDex.includes(dex.dex_type)) {
      dex = modifyMasterDex(dex);
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

      // case "spicy":
      //   pairs.push({
      //     ...buildSimplePair(dex, "wtz"),
      //     dexAddress: config.dexes.spicy.dexRouter,
      //   });
      //   pairs.push({
      //     ...buildSimplePair(dex, "wtz", true),
      //     dexAddress: config.dexes.spicy.dexRouter,
      //   });
      //   break;

      // case "youves":
      //   pairs.push(buildYouvesPair(dex));
      //   pairs.push(buildYouvesPair(dex, true));
      //   break;

      // case "plenty_stable":
      //   pairs.push(buildPlentyStablePair(dex));
      //   pairs.push(buildPlentyStablePair(dex, true));
      //   break;

      // case "flame":
      //   pairs = pairs.concat(buildFlamePairs(dex));
      //   break;

      // case "quipuswap_token2token":
      //   pairs = pairs.concat(buildQuipuToken2TokenPairs(dex));
      //   break;

      // case "quipuswap_v2":
      //   pairs = pairs.concat(buildQuipuV2Pairs(dex));
      //   break;

      case "quipuswap_v3":
        pairs.push(await buildQuipuV3Pairs(dex));
        pairs.push(await buildQuipuV3Pairs(dex, true));
        console.log(pairs);
        break;

      // case "quipuswap_stable":
      //   pairs = pairs.concat(buildQuipuStablePairs(dex));
      //   break;

      // case "plenty_ctez": {
      //   const ctezParams = {
      //     target: BigNumber(
      //       dex.params.find((p) => p.name === "target").value
      //     ).toNumber(),
      //   };
      //   pairs.push({ ...buildSimplePair(dex, "tez"), ...ctezParams });
      //   pairs.push({ ...buildSimplePair(dex, "tez", true), ...ctezParams });
      //   break;
      // }

      // case "wtz": {
      //   const wtzParams = {
      //     swapRatio: BigNumber(
      //       dex.params.find((p) => p.name === "swap_ratio").value
      //     ).toNumber(),
      //     swapRatioPrecision: BigNumber(
      //       dex.params.find((p) => p.name === "swap_ratio_precision").value
      //     ).toNumber(),
      //   };
      //   pairs.push({
      //     ...buildSimplePair(dex, "tez"),
      //     ...wtzParams,
      //   });
      //   pairs.push({
      //     ...buildSimplePair(dex, "tez", true),
      //     ...wtzParams,
      //   });
      //   break;
      // }
    }
  }

  return pairs;
};

export { buildSwapPairs };
