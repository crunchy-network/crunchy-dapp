const buildPair = (rawPair, inverted = false) => {
  let aSide = 0;
  let bSide = 1;
  if (inverted) {
    aSide = 1;
    bSide = 0;
  }

  const pair = { a: {}, b: {} };

  pair.dex = "WTZ";
  pair.dexAddress = rawPair.contractSwap;
  pair.swapRatio = rawPair.swapRatio.toNumber();
  pair.swapRatioPrecision = rawPair.swapRatioPrecision.toNumber();
  pair.direction = inverted ? "Inverted" : "Direct";

  // token A
  pair.a = rawPair.sides[aSide];

  // token B
  pair.b = rawPair.sides[bSide];

  return pair;
};

const buildSwapPairsFromData = (wtzData) => {
  const pairs = [];
  wtzData.sides = [
    {
      tokenSymbol: "WTZ",
      contractType: "fa2",
      tokenAddress: wtzData.contractWtz,
      tokenId: 0,
      decimals: 6,
      assetSlug: `${wtzData.contractWtz}_0`,
      pool: 0,
    },
    {
      tokenSymbol: "tez",
      contractType: "tez",
      tokenAddress: "tez",
      tokenId: undefined,
      decimals: 6,
      assetSlug: "tez",
      pool: 0,
    },
  ];
  pairs.push(buildPair(wtzData));
  pairs.push(buildPair(wtzData, true));
  return pairs;
};

module.exports = { buildSwapPairsFromData };
