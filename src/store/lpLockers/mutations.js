export default {
  updateLpLocksLoading(state, isLoading) {
    state.loading = isLoading;
  },

  updateLpLocksData(state, data) {
    state.data = data;
  },

  updateLpXtzUsdVwap(state, price) {
    state.usdVwap = price;
  },

  updateCurrentPrices(state, prices) {
    state.currentPrices = prices;
    state.crnchyTez = prices[`${state.crnchyAddress}_0`];
  },

  updatePriceFeed(state, feed) {
    state.priceFeed = feed;
  },

  updateTokenPools(state, tokenPools) {
    state.tokenPools = tokenPools;
  },

  updateLpLocksTotalTvlTez(state, total) {
    state.totalTvlTez = total;
  },
};
