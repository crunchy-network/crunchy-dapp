export default {
  updateLoading(state, payload) {
    state.loading = payload;
  },

  updateSearchInput(state, payload) {
    state.searchInput = payload;
  },

  updateTokenList(state, payload) {
    state.tokenList.push(payload);
  },

  setTokenList(state, payload) {
    state.tokenList = payload;
  },

  updateTokenOrder(state, payload) {
    state.tokensOrder = payload;
  },

  updateTokenTracked(state, token) {
    state.tokensTracked[token.id] = token;
  },

  setTokenTracked(state, tokensTracked) {
    state.tokensTracked = tokensTracked || [];
  },

  updateTokensTrackedWithSearch(state, payload) {
    state.tokenList = payload;
  },

  updateTokenOverview(state, payload) {
    state.tokenOverview = payload;
  },
};
