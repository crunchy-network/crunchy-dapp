export default {
  updateRcktLoading(state, isLoading) {
    state.loading = isLoading;
  },

  updateRcktBalance(state, balance) {
    state.balanceRckt = balance;
  },

  updateRkdaoBalance(state, balance) {
    state.balanceRkdao = balance;
  },
};
