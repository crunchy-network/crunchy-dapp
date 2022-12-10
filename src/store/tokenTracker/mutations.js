export default {
  updateLoading(state, payload) {
    state.loading = payload;
  },
  updateLoadingOverview(state, payload) {
    state.loadingOverview = payload;
  },

  updateTokenTrackerSearchInput(state, payload) {
    state.searchInput = payload;
  },

  updateTokenList(state, payload) {
    state.tokenList.push(payload);
  },

  updateTokenListIndex(state, payload) {
    state.tokenList[payload.index] = payload.token;
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

  async updateTokenOverview(state, payload) {
    state.tokenOverview = { ...state.tokenOverview, ...payload };
  },
  updateChartData(state, payload) {
    state.tokenOverview.chartData = payload;
  },

  updateChartDataLoading(state, payload) {
    state.loadingChart = payload;
  },
  cleanTokenOverview(state) {
    state.tokenOverview = {
      chartData: {
        volumeAndPrice1Day: [],
        volumeAndPrice7Day: [],
        volumeAndPrice30Day: [],
        allVolumeAndPrice: [],
        tvl1Day: [],
        tvl7Day: [],
        tvl30Day: [],
        tvlAll: [],
      },
    };
  },
};
