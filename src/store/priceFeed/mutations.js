export default {
  setLoading(state, loading) {
    state.loading = loading;
  },

  setXtzUsdtPrice(state, price) {
    state.xtzUsdtPrice = price;
  },

  setXtzUsdtPriceHistory(state, history) {
    state.xtzUsdtPriceHistory = history;
  },

  setPriceFeed(state, priceFeed) {
    state.data = priceFeed;
  },
};
