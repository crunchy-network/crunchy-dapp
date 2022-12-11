module.exports = {
  minPoolSize: 15000000, // muTez
  excludedTokens: ["ANTI"],
  addresses: {
    "wtz": process.env.VUE_APP_CONTRACTS_WTZ_FA2,
  },
  dexes: {
    youves: {
      cashTokens: [ "kUSD", "WUSDC", "tzBTC", "USDTz", "USDt" ],
    },
    spicy: {
      dexRouter: "KT1PwoZxyv4XkPEGnTqWYvjA1UYiPTgAGyqL",
    }
  },
};
