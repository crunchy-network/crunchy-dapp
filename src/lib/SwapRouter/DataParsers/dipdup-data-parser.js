const config = require("../config");

const tez = {
  symbol: "tez",
  tokenSymbol: "tez",
  type: "tez",
  tokenAddress: "tez",
  decimals: 6,
  assetSlug: "tez",
};

const getType = (typeStr) => {
  if (typeStr === "fa12") {
    return "fa1.2";
  }
  return typeStr;
};

const createPairSide = (dex) => {
  const { token, tokenPool } = dex;
  const tokenId = token.tokenId !== undefined ? token.tokenId : 0;
  const side = {
    symbol: token.symbol,
    tokenSymbol: token.symbol,
    tokenId,
    tokenAddress: token.address,
    decimals: token.decimals,
    contractType: getType(token.standard),
    pool: parseFloat(tokenPool),
    assetSlug: `${token.address}_${tokenId}`,
  };

  return side;
};
const isKnownDex = (dexName) => {
  const knownDexes = ["quipuswap", "lb"];
  return knownDexes.includes(dexName);
};

const buildPair = (dex, inverse = false) => {
  const tezSide = { ...tez, pool: parseFloat(dex.tezPool) };
  const tokenSide = createPairSide(dex);
  const direction = inverse ? "Inverted" : "Direct";
  const dexName = dex.name === "lb" ? "LiquidityBaking" : "Quipuswap";
  const pair = { dex: dexName, direction, dexAddress: dex.address };
  if (inverse) {
    pair.a = tokenSide;
    pair.b = tezSide;
  } else {
    pair.a = tezSide;
    pair.b = tokenSide;
  }
  return pair;
};

const isPoolBelowMinThreshold = (dex) => {
  return parseFloat(dex.tezPool) < 15;
};

const shouldSkip = (dex) => {
  if (config.excludedTokens.includes(dex.token.symbol)) {
    return true;
  }
  return isPoolBelowMinThreshold(dex);
};

function buildSwapPairsFromPriceData(dexes) {
  const pairs = [];
  for (var i = 0; i < dexes.length; i++) {
    const dex = dexes[i];
    if (shouldSkip(dex)) {
      continue;
    }
    if (!isKnownDex(dex.name)) {
      console.log("unknown dex", dex);
      continue;
    }
    pairs.push(buildPair(dex));
    pairs.push(buildPair(dex, true));
  }
  return pairs;
}

module.exports = { buildSwapPairsFromPriceData };
