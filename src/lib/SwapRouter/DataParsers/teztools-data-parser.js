const config = require("../config");

// returns token we are on, and finds the other side of the pair in the token list
const getTokenPair = (tokens, tokenIndex, pairIndex) => {
  const token1 = tokens[tokenIndex];
  const token2Symbol = token1.pairs[pairIndex].sides[1].symbol;
  let token2;
  if (token2Symbol === "XTZ") {
    token2 = { symbol: "tez", type: "tez", tokenAddress: "tez", decimals: 6 };
  } else {
    token2 = tokens.find((token) => token.symbol === token2Symbol);
  }

  return { token1, token2 };
};

const isKnownDex = (dexName) => {
  const knownDexes = ["Quipuswap", "Plenty", "Liquidity Baking"];
  return knownDexes.includes(dexName);
};

const getDexName = (dexName) => {
  if (dexName === "Liquidity Baking") {
    return "LiquidityBaking";
  }
  return dexName;
};
const getTokenId = (token) => {
  if (token.symbol === "tez") return undefined;

  if (token.tokenId !== undefined) {
    return token.tokenId;
  }
  if (token.type === "fa1.2") {
    return 0;
  }
  return undefined;
};

const createAssetSlug = (token) => {
  if (token.symbol === "tez") return "tez";
  const tokenId = getTokenId(token);
  if (tokenId !== undefined) {
    return `${token.tokenAddress}_${tokenId}`;
  }
  return token.tokenAddress;
};

// type PairSide: { tokenId: string, tokenAddress: string, contractType: string, decimals: number, tokenSymbol: string, pool: number, assetSlug: string }
const createPairSide = (token, side) => {
  return {
    tokenId: getTokenId(token),
    tokenAddress: token.tokenAddress,
    decimals: token.decimals,
    contractType: token.type,
    tokenSymbol: token.symbol,
    pool: side.pool,
    assetSlug: createAssetSlug(token),
  };
};

/*
buildPair returns an object with this shape 
type SwapPair { dex: string, dexAddress: string, direction: string, a: PairSide, b: PairSide }
for TS future reference
*/
const buildPair = (tokens, tokenIndex, pairIndex, direction = "Direct") => {
  let aSide = 0;
  let bSide = 1;
  const tokenPair = getTokenPair(tokens, tokenIndex, pairIndex);
  let tokenA = tokenPair.token1;
  let tokenB = tokenPair.token2;
  if (direction === "Inverted") {
    aSide = 1;
    bSide = 0;
    tokenA = tokenPair.token2;
    tokenB = tokenPair.token1;
  }
  const rawPair = tokens[tokenIndex].pairs[pairIndex];

  const pair = { a: {}, b: {} };

  // common properties
  pair.dex = getDexName(rawPair.dex);
  pair.dexAddress = rawPair.address;
  pair.direction = direction;

  // token A
  pair.a = createPairSide(tokenA, rawPair.sides[aSide]);

  // token B
  pair.b = createPairSide(tokenB, rawPair.sides[bSide]);

  // return statement
  return pair;
};

const isPoolBelowMinThreshold = (side) => {
  if (side.symbol !== "XTZ") {
    // TODO see if there's a way to check value of non-xtz pools
    return false;
  }
  const poolInMuTez = side.pool * Math.pow(10, 6);
  return poolInMuTez < config.minPoolSize;
};

const shouldSkip = (pair) => {
  if (config.excludedTokens.includes(pair.sides[0].symbol)) {
    return true;
  }
  if (config.excludedTokens.includes(pair.sides[1].symbol)) {
    return true;
  }
  if (isPoolBelowMinThreshold(pair.sides[0])) {
    return true;
  }
  if (isPoolBelowMinThreshold(pair.sides[1])) {
    return true;
  }
  return false;
};

// takes json from https://api.teztools.io/v1/prices as input and returns an array of swap pairs and their inverses
const buildSwapPairsFromPriceData = (tokens) => {
  const pairs = [];
  for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    for (
      var pairIndex = 0;
      pairIndex < tokens[tokenIndex].pairs.length;
      pairIndex++
    ) {
      if (shouldSkip(tokens[tokenIndex].pairs[pairIndex])) {
        continue;
      }
      if (isKnownDex(tokens[tokenIndex].pairs[pairIndex].dex)) {
        pairs.push(buildPair(tokens, tokenIndex, pairIndex));
        pairs.push(buildPair(tokens, tokenIndex, pairIndex, "Inverted"));
      }
    }
  }
  return pairs;
};

module.exports = { buildSwapPairsFromPriceData };
