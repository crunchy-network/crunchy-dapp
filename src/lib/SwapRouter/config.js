module.exports = {
  minPoolSize: 15000000, // muTez
  excludedTokens: ["ANTI", "crDAO", "CRUNCH"],
  addresses: {
    wtz: process.env.VUE_APP_CONTRACTS_WTZ_FA2,
  },
  dexes: {
    youves: {
      cashTokens: ["kUSD", "wUSDC", "tzBTC", "USDtz", "USDt"],
    },
    spicy: {
      dexRouter: "KT1PwoZxyv4XkPEGnTqWYvjA1UYiPTgAGyqL",
    },
  },
  excludedDexes: [
    "KT1LCGKA33zGk8GDQbtonGzFMzqx8QPbeZbr",
    "KT1CZj28Xc3Rtg1AsRfsagZyxcLEzAkwGXug",
    "KT1ALzTtaDzWX49whjJtMwvu8gNrR4c7rbL1",
  ]
};
