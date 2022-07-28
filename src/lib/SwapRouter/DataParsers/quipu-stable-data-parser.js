const buildPair = (dex, token1, token1Index, token2, token2Index) => {
  const pair = {};

  pair.dex = dex.dex;
  pair.dexAddress = dex.address;
  pair.direction = "Direct";
  pair.tokensInfo = dex.tokensInfo;
  pair.fee = dex.fee;
  pair.pool = dex;
  pair.a = {
    tokenId: token1.tokenId,
    tokenAddress: token1.address,
    contractType: token1.type,
    decimals: token1.decimals,
    tokenSymbol: token1.tokenSymbol,
    pool: token1.reserves.toNumber() / Math.pow(10, token1.decimals),
    assetSlug: `${token1.address}_${token1.tokenId}`,
    infoIndex: token1Index,
  };
  pair.b = {
    cash: true,
    tokenId: token2.tokenId,
    tokenAddress: token2.address,
    contractType: token2.type,
    decimals: token2.decimals,
    tokenSymbol: token2.tokenSymbol,
    pool: token2.reserves.toNumber() / Math.pow(10, token2.decimals),
    assetSlug: `${token2.address}_${token2.tokenId}`,
    infoIndex: token2Index,
  };
  return pair;
};

const buildSwapPairsFromData = (data) => {
  const pairs = [];
  for (var i = 0; i < data.length; i++) {
    const dex = data[i];
    for (var t1 = 0; t1 < dex.tokensInfo.length; t1++) {
      const token1 = dex.tokensInfo[t1];

      for (var t2 = 0; t2 < dex.tokensInfo.length; t2++) {
        if (t2 === t1) {
          continue;
        }
        const token2 = dex.tokensInfo[t2];
        pairs.push(buildPair(dex, token1, t1, token2, t2));
      }
    }
  }
  return pairs;
};

module.exports = {
  buildSwapPairsFromData,
};
