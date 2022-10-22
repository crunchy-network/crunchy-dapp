export default {
  updateLoading(state, payload) {
    state.loading = payload;
  },

  updateSearchInput(state, payload) {
    state.searchInput = payload;
  },

  updateTokenList(state, payload) {
    state.tokenList = payload;
  },

  updateTokenTracked(state, token) {
    state.tokensTracked.push(token);
  },

  updateTokensTrackedWithSearch(state, payload) {
    state.tokenList = payload;
  },
};
