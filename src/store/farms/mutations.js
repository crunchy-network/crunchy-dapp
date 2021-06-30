export default {

  updateFarmsLoading (state, isLoading) {
    state.loading = isLoading;
  },

  updateFarmsExpanded (state, isExpanded) {
    state.expanded = isExpanded;
  },

  updateFarmsSearchInput (state, input) {
    state.searchInput = input;
  },

  updateFarmsFilters (state, filters) {
    state.filters = filters;
  },

  updateFarmsData (state, data) {
    state.data = data;
  },

  updateFarm (state, farm) {
    state.data[farm.id] = farm;
  },

  updateXtzUsdVwap (state, price) {
    state.usdVwap = price;
  },

  updateTotalTvlTez (state, total) {
    state.totalTvlTez = total;
  },

  updateCrunchTez (state, price) {
    state.crunchTez = price;
  },

  updateCrdaoTez (state, price) {
    state.crdaoTez = price;
  },

  updateCurrentPrices (state, prices) {
    state.currentPrices = prices;
    state.crdaoTez = prices[`${state.crdaoAddress}_0`];
    state.crunchTez = prices[`${state.crunchAddress}_0`];
  },

  updatePriceFeed (state, feed) {
    state.priceFeed = feed;
  }

}
