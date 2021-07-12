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

  updateFarmRowExpanded (state, { farmId, rowExpanded }) {
    state.data[farmId].rowExpanded = rowExpanded;
  },

  updateFarmVisible (state, { farmId, visible }) {
    state.data[farmId].visible = visible;
  },

  updateFarmLoading (state, { farmId, loading }) {
    state.data[farmId].loading = loading;
  },

  updateFarmRewardsEarned (state, { farmId, rewardsEarned }) {
    state.data[farmId].rewardsEarned = rewardsEarned;
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
  },

  updateFarmStorage (state, data) {
    state.storage.farms = data;
  },

  updateFarmUserRecordStorage (state, data) {
    state.storage.userRecords = data;
  }

}
