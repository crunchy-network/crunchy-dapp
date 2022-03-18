export default {
  updateWtzLoading(state, isLoading) {
    state.loading = isLoading;
  },

  updateWtzXtzUsdVwap(state, price) {
    state.usdVwap = price;
  },

  updateWtzTotalTvlTez(state, total) {
    state.totalTvlTez = total;
  },

  updateWtzBalance(state, balance) {
    state.balance = balance;
  },

  updateWtzSwapRatio(state, swapRatio) {
    state.swapRatio = swapRatio;
  },

  updateWtzTransactions(state, txs) {
    console.log("txs", txs);
    state.txs = txs;
  },
};
