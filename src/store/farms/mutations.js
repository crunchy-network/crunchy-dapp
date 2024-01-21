export default {
  updateFarmsLoading(state, isLoading) {
    state.loading = isLoading;
  },

  updateFarmsExpanded(state, isExpanded) {
    state.expanded = isExpanded;
  },

  updateMyFarmsExpanded(state, isExpanded) {
    state.myFarmExpanded = isExpanded;
  },

  updateFarmsSearchInput(state, input) {
    state.searchInput = input;
  },

  updateFarmsFilters(state, filters) {
    state.filters = filters;
  },

  updateFarmsData(state, data) {
    state.data = data;
  },

  updateFarm(state, farm) {
    state.data[farm.id] = farm;

    if (farm.depositAmount > 0) {
      state.userData[farm.id] = farm;
    }
  },

  updateFarmRowExpanded(state, { farmId, rowExpanded }) {
    state.data[farmId].rowExpanded = rowExpanded;
  },

  updateFarmVisible(state, { farmId, visible }) {
    state.data[farmId].visible = visible;
  },

  updateUserFarmVisible(state, { farmId, visible }) {
    state.userData[farmId].visible = visible;
  },

  updateFarmLoading(state, { farmId, loading }) {
    state.data[farmId].loading = loading;
  },

  updateFarmRewardsEarned(state, { farmId, rewardsEarned }) {
    state.data[farmId].rewardsEarned = rewardsEarned;
  },

  updateXtzUsdVwap(state, price) {
    state.usdVwap = price;
  },

  updateTotalTvlTez(state, total) {
    state.totalTvlTez = total;
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

  updateLpTokens(state, lpTokens) {
    state.lpTokens = lpTokens;
  },

  updateFarmStorage(state, data) {
    state.storage.farms = data;
  },

  updateFarmUserRecordStorage(state, data) {
    state.storage.userRecords = data;
  },

  updateVaultStorage(state, data) {
    state.storage.vaults = data;
  },
};
