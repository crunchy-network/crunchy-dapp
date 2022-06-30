const config = require("../config");
// const BigNumber = require("bignumber.js");

// type PairSide: { tokenId: string, tokenAddress: string, contractType: string, decimals: number, tokenSymbol: string, pool: number, assetSlug: string }
const createPairSide = (side) => {
  let [tokenAddress, tokenId] = side.tag.split(":");
  let type = "fa2";
  if (tokenId === "null") {
    tokenId = 0;
    type = "fa1.2";
  }
  return {
    tokenId,
    tokenAddress,
    decimals: side.decimals,
    contractType: tokenId === undefined ? "tez" : type,
    tokenSymbol: side.symbol,
    pool: side.pool,
    assetSlug: tokenAddress === "tez" ? "tez" : `${tokenAddress}_${tokenId}`,
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

  pair.dex = "Spicy";
  pair.dexAddress = "KT1PwoZxyv4XkPEGnTqWYvjA1UYiPTgAGyqL";
  pair.direction = inverted ? "Inverted" : "Direct";

  // token A
  pair.a = createPairSide(rawPair.sides[aSide]);

  // token B
  pair.b = createPairSide(rawPair.sides[bSide]);

  return pair;
};

const isPoolBelowMinThreshold = (xtz) => {
  const poolInMuTez = xtz * Math.pow(10, 6);
  return poolInMuTez < config.minPoolSize;
};

const shouldSkip = (pair, token0, token1) => {
  if (config.excludedTokens.includes(token0.symbol)) {
    return true;
  }
  if (config.excludedTokens.includes(token1.symbol)) {
    return true;
  }
  if (isPoolBelowMinThreshold(pair.reservextz)) {
    return true;
  }
  return false;
};

const buildSwapPairsFromData = (data) => {
  const pairs = [];
  for (const rawPair of data.pair_info) {
    const token0 = data.tokens.find((t) => t.tag === rawPair.token0);
    const token1 = data.tokens.find((t) => t.tag === rawPair.token1);
    if (shouldSkip(rawPair, token0, token1)) {
      continue;
    }
    rawPair.sides = [
      { ...token0, pool: Number(rawPair.reserve0) },
      { ...token1, pool: Number(rawPair.reserve1) },
    ];
    pairs.push(buildPair(rawPair));
    pairs.push(buildPair(rawPair, true));
  }
  return pairs;
};

module.exports = { buildSwapPairsFromData };
