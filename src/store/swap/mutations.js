export default {
  updateSwapLoading(state, isLoading) {
    state.loading = isLoading;
  },
  updateCurrentTrade(state, trade) {
    state.currentTrade = trade;
  },
  updateTransactionParams(state, params) {
    state.transactionParams = params;
  },
  updateTokenList(state, tokens) {
    state.tokenList = tokens;
  },
  updateDexList(state, dexList) {
    state.dexList = dexList;
  },
  updateSwapForm(state, newVal) {
    state.swapForm = { ...state.swapForm, ...newVal };
  },
  updateSwapPairs(state, newVal) {
    state.swapPairs = newVal;
  },
  updateSwapPairsNew(state, newVal) {
    state.swapPairsNew = newVal;
  },
  updateDexPairs(state, payload) {
    state.dexApis[payload.dex].pairs = payload.pairs;
  },
  updateDexLoading(state, payload) {
    state.dexApis[payload.dex].loading = payload.loading;
  },
  updateIsCalculatingBestRoute(state, payload) {
    state.isCalculatingBestRoute = payload;
  },
};
