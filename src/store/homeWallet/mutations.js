export default {
  updateHomeWalletLoading(state, isLoading) {
    state.loading = isLoading;
  },

  updateAssets(state, assets) {
    state.assets = assets.assets;
    state.nfts = assets.nfts;
  },

  updateNetworth(state, value) {
    state.netWorth = value;
  },

  updateNetworthUsd(state, value) {
    state.netWorthUsd = value;
  },

  updateCrDAOBal(state, value) {
    state.crDaoBal = value;
  },

  updateCrunchBal(state, value) {
    state.crunchBal = value;
  },
};
