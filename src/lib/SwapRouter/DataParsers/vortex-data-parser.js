const config = require("../config");

const createAssetSlug = (token) => {
  if (token.symbol === "tez") return "tez";
  const tokenId = getTokenId(token);
  if (tokenId !== undefined) {
    return `${token.address}_${tokenId}`;
  }
  return token.tokenAddress;
};

const getTokenId = (side) => {
  if (side.symbol === "tez") return undefined;

  if (side.tokenId !== undefined) {
    return side.tokenId;
  }
  if (side.contractFormat === "FA12") {
    return 0;
  }
  return undefined;
};

const getTokenType = (side) => {
  if (side.contractFormat === "FA12") {
    return "fa1.2";
  }
  if (side.contractFormat === "FA2") {
    return "fa2";
  }
  return side.contractFormat;
};

// type PairSide: { tokenId: string, tokenAddress: string, contractType: string, decimals: number, tokenSymbol: string, pool: number, assetSlug: string }
const createPairSide = (side) => {
  if (side.symbol === "XTZ") {
    side = {
      ...side,
      symbol: "tez",
      contractFormat: "tez",
      address: "tez",
      decimals: 6,
    };
  }

  return {
    tokenId: getTokenId(side),
    tokenAddress: side.address,
    decimals: side.decimals,
    contractType: getTokenType(side),
    tokenSymbol: side.symbol,
    pool: side.pool,
    assetSlug: createAssetSlug(side),
  };
};

const buildPair = (rawPair, inverted = false) => {
  let aSide = 0;
  let bSide = 1;
  if (inverted) {
    aSide = 1;
    bSide = 0;
  }

  const pair = { a: {}, b: {} };

  pair.dex = "Vortex";
  pair.dexAddress = rawPair.pool_address;
  pair.direction = inverted ? "Inverted" : "Direct";

  // token A
  pair.a = createPairSide(rawPair.sides[aSide]);

  // token B
  pair.b = createPairSide(rawPair.sides[bSide]);

  return pair;
};

const isPoolBelowMinThreshold = (token) => {
  const poolInMuTez = token.pool * Math.pow(10, token.decimals);
  return poolInMuTez < config.minPoolSize;
};

const shouldSkip = (rawPair) => {
  if (rawPair.pool_address === "KT1QJjgtiGtsyb21HpCAPFUETEmMnPeDERCD") {
    return true;
  }
  if (config.excludedTokens.includes(rawPair.token0.symbol)) {
    return true;
  }
  if (config.excludedTokens.includes(rawPair.token1.symbol)) {
    return true;
  }
  if (
    isPoolBelowMinThreshold({ ...rawPair.token0, pool: rawPair.token0_pool })
  ) {
    return true;
  }
  if (
    isPoolBelowMinThreshold({ ...rawPair.token1, pool: rawPair.token1_pool })
  ) {
    return true;
  }
  return false;
};

const buildSwapPairsFromPoolData = (data) => {
  const pairs = [];
  for (const rawPair of data) {
    // PAUL; skip it
    if (shouldSkip(rawPair)) {
      continue;
    }
    rawPair.sides = [
      { ...rawPair.token0, pool: rawPair.token0_pool },
      { ...rawPair.token1, pool: rawPair.token1_pool },
    ];
    pairs.push(buildPair(rawPair));
    pairs.push(buildPair(rawPair, true));
  }
  return pairs;
};

module.exports = { buildSwapPairsFromPoolData };
