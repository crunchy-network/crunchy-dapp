export default {
  updateHomeWalletLoading(state, isLoading) {
    state.loading = isLoading;
  },

  updateAssets(state, assets) {
    state.assets = assets.assets;
  },
  updateNfts(state, assets) {
    state.nfts = assets.collections;
  },
  updatePortfolio(state, value) {
    state.portfolio = value;
  },

  updatePortfolioUsd(state, value) {
    state.portfolioUsd = value;
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
  // updateFeed(state, value) {
  //   state.feed = value;
  // },

  updateNftsLoading(state, value) {
    state.loadingNfts = value;
  },

  updateNftCollection(state, value) {
    state.nftCollection = value;
  },

  updateQuipuswapLp(state, value) {
    state.lp.quipuswap = { ...state.lp.quipuswap, ...value };
  },
  updateVortexLp(state, value) {
    state.lp.vortex = { ...state.lp.vortex, ...value };
  },
  updateSpicyLp(state, value) {
    state.lp.spicyswap = { ...state.lp.spicyswap, ...value };
  },
  updatePlentyLp(state, value) {
    state.lp.plenty = { ...state.lp.plenty, ...value };
  },
  updateSiriusLp(state, value) {
    state.lp.sirius = { ...state.lp.sirius, ...value };
  },
  updateLpLoading(state, value) {
    state.lp.loading = value;
  },
};
