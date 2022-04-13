const isCtezTez = (pair) => {
  return pair.address === "KT1CAYNQGvYSF5UvHK21grMrKpe2563w9UcX";
};

const muTezToTokens = (pool, token) => {
  return pool / Math.pow(10, token.decimals);
};
// type PairSide: { tokenId: string, tokenAddress: string, contractType: string, decimals: number,
// tokenSymbol: string, pool: number, assetSlug: string }
const getToken = (token) => {
  if (token.symbol === "XTZ") {
    return {
      tokenId: null,
      address: "tez",
      type: "tez",
      symbol: "tez",
      decimals: token.decimals,
      assetSlug: "tez",
    };
  }
  return token;
};

const buildSides = (pair) => {
  const a = getToken(pair.token1);
  const aId = a.tokenId !== undefined ? a.tokenId : 0;
  const sideA = {
    cash: false,
    tokenId: aId,
    tokenAddress: a.address,
    contractType: a.type.toLowerCase(),
    decimals: a.decimals,
    tokenSymbol: a.symbol,
    pool: muTezToTokens(pair.token1Amount, a),
    precision: pair.token1Precision,
    assetSlug: a.assetSlug ? a.assetSlug : `${a.address}_${aId}`,
  };
  const b = getToken(pair.token2);
  const bId = b.tokenId !== undefined ? b.tokenId : 0;

  const sideB = {
    cash: true,
    tokenId: bId,
    tokenAddress: b.address,
    contractType: b.type.toLowerCase(),
    decimals: b.decimals,
    tokenSymbol: b.symbol,
    pool: muTezToTokens(pair.token2Amount, b),
    precision: pair.token2Precision,
    assetSlug: b.assetSlug ? b.assetSlug : `${b.address}_${bId}`,
  };

  return { sideA, sideB };
};

const buildPair = (pair, inverse = false) => {
  const newPair = {};
  newPair.dex = isCtezTez(pair) ? "PlentyCtezTez" : "PlentyStable";
  newPair.dexAddress = pair.address;
  newPair.target = pair.target;
  const { sideA, sideB } = buildSides(pair);
  if (!inverse) {
    newPair.direction = "Direct";
    newPair.a = sideA;
    newPair.b = sideB;
  } else {
    newPair.direction = "Inverted";
    newPair.a = sideB;
    newPair.b = sideA;
  }

  return newPair;
};

const buildSwapPairsFromData = (data) => {
  const pairs = [];
  for (var i = 0; i < data.length; i++) {
    pairs.push(buildPair(data[i]));
    pairs.push(buildPair(data[i], true));
  }
  return pairs;
};

module.exports = { buildSwapPairsFromData };
