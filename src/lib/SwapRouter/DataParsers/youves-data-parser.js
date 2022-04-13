// const youvesDexes = [
//   "KT1AVbWyM8E7DptyBCu4B5J5B7Nswkq7Skc6",
//   "KT1JeWiS8j1kic4PHx7aTnEr9p4xVtJNzk5b",
//   "KT1T974a8qau4xP3RAAWPYCZM9xtwU9FLjPS",
//   "KT1Xbx9pykNd38zag4yZvnmdSNBknmCETvQV",
//   "KT1XvH5f2ja2jzdDbv6rxPmecZFU7s3obquN",
// ];

// const knownNonYouvesDexes = [
//   "KT1EAw8hL5zseB3SLpJhBqPQfP9aWrWh8iMW",
//   "KT1EtjRRCBC2exyCRXz8UfV7jz7svnkqi7di",
//   "KT1H8sJY2VzrbiX4pYeUVsoMUd4iGw2DV7XH",
//   "KT1JbUFVGrMCpW39UtH97dMkG2nMMrefQLLa",
//   "KT1LzyPS8rN375tC31WPAVHaQ4HyBvTSLwBu",
//   "KT1MRMsyWYCwf2ex2wN4yuihJbNykCDHdRTT",
//   "KT1ND1bkLahTzVUt93zbDtGugpWcL23gyqgQ",
//   "KT1PL1YciLdwMbydt21Ax85iZXXyGSrKT2BE",
//   "KT1TnrLFrdemNZ1AnnWNfi21rXg7eknS484C",
//   "KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5",
//   "KT1VSjJxNq98AkPfVktpCv82hacrvgkb6hEu",
//   "KT1W2VfA2ofdiNR2vRE4phSEeTgfvGyY8p64",
//   "KT1Wjadao8AXkwNQmjstbPGtLd1ZrUyQEDX7",
// ];

const getCashAssetSlug = (pool) => {
  if (pool.cashId) {
    return `${pool.cashAddress}_${pool.cashId}`;
  }
  return `${pool.cashAddress}_0`;
};
// type PairSide: { tokenId: string, tokenAddress: string, contractType: string, decimals: number, tokenSymbol: string, pool: number, assetSlug: string }

const convertMutTezToTokens = (pool, decimals) => {
  return pool / Math.pow(10, decimals);
};

const createPairSides = (pool) => {
  const tokenSide = {
    cash: false,
    pool: convertMutTezToTokens(pool.tokenPool, pool.tokenDecimals),
    tokenId: pool.tokenId,
    tokenAddress: pool.tokenAddress,
    contractType: "fa2",
    decimals: pool.tokenDecimals,
    tokenSymbol: pool.tokenSymbol,
    assetSlug: `${pool.tokenAddress}_${pool.tokenId}`,
  };
  const cashSide = {
    cash: true,
    pool: convertMutTezToTokens(pool.cashPool, pool.cashDecimals),
    contractType: pool.cashId ? "fa2" : "fa1.2",
    tokenId: pool.cashId ? pool.cashId : 0,
    tokenAddress: pool.cashAddress,
    decimals: pool.cashDecimals,
    tokenSymbol: pool.cashSymbol,
    assetSlug: getCashAssetSlug(pool),
  };

  return { tokenSide, cashSide };
};

const buildPair = (rawPair, inverted = false) => {
  const pair = { a: {}, b: {} };

  pair.dex = "Youves";
  pair.dexAddress = rawPair.dexAddress;
  pair.direction = inverted ? "Inverted" : "Direct";
  const sides = createPairSides(rawPair);

  if (inverted) {
    pair.a = sides.cashSide;
    pair.b = sides.tokenSide;
  } else {
    pair.a = sides.tokenSide;
    pair.b = sides.cashSide;
  }

  return pair;
};

const buildSwapPairsFromData = (data) => {
  const pairs = [];
  for (var index = 0; index < data.length; index++) {
    const rawPair = data[index];
    pairs.push(buildPair(rawPair));
    pairs.push(buildPair(rawPair, true));
  }
  return pairs;
};

module.exports = { buildSwapPairsFromData };
