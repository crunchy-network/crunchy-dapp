const axios = require("axios");
// const dex_fee = 0.15;
const { BigNumber } = require("bignumber.js");
const getContractStorage = async (dexAddress, poolIndex) => {
  return axios.get(`https://api.tzkt.io/v1/bigmaps/${poolIndex}/keys`);
};

const stableTokens = {
  uUSD: {
    tokenSymbol: "uUSD",
    address: "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
    decimals: 12,
    tokenId: 0,
    type: "fa2",
  },
  USDtz: {
    tokenSymbol: "USDtz",
    address: "KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9",
    decimals: 6,
    tokenId: 0,
    type: "fa1.2",
  },
  kUSD: {
    tokenSymbol: "kUSD",
    address: "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
    decimals: 18,
    tokenId: 0,
    type: "fa1.2",
  },
  USDC_e: {
    tokenSymbol: "USDC.e",
    address: "KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY",
    tokenId: 2,
    decimals: 6,
    type: "fa2",
  },
  tzBTC: {
    tokenSymbol: "tzBTC",
    address: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
    tokenId: 0,
    decimals: 8,
    type: "fa1.2",
  },
  uBTC: {
    tokenSymbol: "uBTC",
    address: "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
    tokenId: 2,
    decimals: 12,
    type: "fa2",
  },
  USDt: {
    tokenSymbol: "USDt",
    address: "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
    tokenId: 0,
    decimals: 6,
    type: "fa2",
  },
  apUSDC: {
    tokenSymbol: "apUSDC",
    address: "KT1UG6PdaKoJcc3yD6mkFVfxnS1uJeW3cGeX",
    tokenId: 2,
    decimals: 6,
    type: "fa2",
  },
  abBUSD: {
    tokenSymbol: "abBUSD",
    address: "KT1UG6PdaKoJcc3yD6mkFVfxnS1uJeW3cGeX",
    tokenId: 1,
    decimals: 6,
    type: "fa2",
  },
};

const dexes = [
  {
    address: "KT1KMUVh3Mf9P6yn8tkzku197kcYjoZ3qChi",
    poolIndex: "199487",
    tokens: [
      { ...stableTokens.kUSD },
      { ...stableTokens.USDtz },
      { ...stableTokens.uUSD },
    ],
  },
  {
    address: "KT1QcKtFA2gEXXQLDKJa8UZ2mBy9mzyMnbfX",
    poolIndex: "199521",
    tokens: [{ ...stableTokens.USDC_e }, { ...stableTokens.uUSD }],
  },
  {
    address: "KT1WHyfr6RwJt2FKW7FgvA6sFvPPrzrMmcZt",
    poolIndex: "199501",
    tokens: [{ ...stableTokens.tzBTC }, { ...stableTokens.uBTC }],
  },
  {
    address: "KT1P8cMDVmp2RdkW8Qgpwa9uR32TgbcLB7PN",
    poolIndex: "237395",
    tokens: [
      { ...stableTokens.kUSD },
      { ...stableTokens.uUSD },
      { ...stableTokens.USDt },
    ],
  },
  {
    address: "KT1M2b4XCUq5zqMNqQAotUar7BSUiNDE4Dgh",
    poolIndex: "322555",
    tokens: [
      { ...stableTokens.abBUSD },
      { ...stableTokens.apUSDC },
      { ...stableTokens.USDt },
    ],
  },
];

module.exports = {
  async getQuipuswapStableDexes() {
    const toRet = [];
    for (var i = 0; i < dexes.length; i++) {
      const dex = dexes[i];
      const resp = await getContractStorage(dex.address, dex.poolIndex);
      const storage = resp.data[0].value;
      const dexObj = { dex: "QuipuswapStable", address: dex.address };
      dexObj.tokensInfo = Object.keys(storage.tokens_info).map((k, i) => {
        const poolData = storage.tokens_info[k];
        const token = dex.tokens[i];
        return {
          ...token,
          rate: new BigNumber(poolData.rate_f),
          reserves: new BigNumber(poolData.reserves),
        };
      });
      dexObj.fee = {
        liquidityProvidersFee: new BigNumber(storage.fee.lp_f),
        stakersFee: new BigNumber(storage.fee.stakers_f),
        interfaceFee: new BigNumber(storage.fee.ref_f),
        devFee: new BigNumber(4500000),
      };
      dexObj.initialA = new BigNumber(storage.initial_A_f);
      dexObj.initialATime = storage.initial_A_time;
      dexObj.futureA = new BigNumber(storage.future_A_f);
      dexObj.futureATime = storage.future_A_time;
      dexObj.poolId = 0;
      toRet.push(dexObj);
    }
    return toRet;
  },
};
