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
    state.crdaoTez = prices[`${state.crdaoAddress}_0`];
    state.crunchTez = prices[`${state.crunchAddress}_0`];
  },

  updatePriceFeed(state, feed) {
    state.priceFeed = feed;
  },

  updateLpLocksTotalTvlTez(state, total) {
    state.totalTvlTez = total;
  },
};
