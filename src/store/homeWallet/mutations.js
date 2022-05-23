export default {
  updateHomeWalletLoading(state, isLoading) {
    state.loading = isLoading;
  },

  updateAssets(state, assets) {
    state.assets = assets;
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

  updateCrunchyStake(state, value) {
    state.crunchyStake = value;
  },
  updateStakeLoading(state, value) {
    state.loadingStake = value;
  },
};
