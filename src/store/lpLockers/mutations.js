export default {

  updateLpLocksLoading (state, isLoading) {
    state.loading = isLoading;
  },

  updateLpLocksData (state, data) {
    state.data = data;
  },

  updateLpXtzUsdVwap (state, price) {
    state.usdVwap = price;
  }

}
