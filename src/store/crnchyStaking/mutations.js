export default {
  updateCrnchyStakingLoading(state, loading) {
    state.loading = loading;
  },

  updateCrnchyStakingSummary(state, summary) {
    state.summary = summary;
  },

  updateCrnchyStakingSettings(state, settings) {
    state.settings = settings;
  },

  updateCrnchyStakingCurrentCycle(state, cycle) {
    state.currentCycle = cycle;
  },

  updateCrnchyStakingNextCycle(state, cycle) {
    state.nextCycle = cycle;
  },

  updateCrnchyMyStaking(state, myStaking) {
    state.myStaking = myStaking;
  },
};
