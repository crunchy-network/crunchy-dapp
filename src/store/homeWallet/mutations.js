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

  updateCrunchyStake(state, value) {
    state.crunchyStake = value;
  },
  updateQuipusStake(state, value) {
    state.quipusStake = value;
  },
  updateDogamiStake(state, value) {
    state.dogamiStake = value;
  },
  updateGIFStake(state, value) {
    state.gifStake = value;
  },
  updateStakeLoading(state, value) {
    state.loadingStake = value;
  },
  updatePriceFeed(state, value) {
    state.priceFeed = value;
  },
};
