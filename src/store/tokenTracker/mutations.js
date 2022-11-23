import tokenTracker from "../../utils/token-tracker";

const YESTERDAY = new Date(Date.now() - 86400000).toISOString();
const WEEK_AGO = new Date(Date.now() - 7*86400000).toISOString();
const MONTH_AGO = new Date(Date.now() - 30*86400000).toISOString();

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
    state.tokenOverview = payload;
    const correctTokenId = state.tokenOverview.tokenId != undefined ? state.tokenOverview.tokenId : 0;
    const tokenId = state.tokenOverview.tokenAddress + "_" + correctTokenId;
    try {
      const [volumeAndPrice1Day, volumeAndPrice7Day, volumeAndPrice30Day, tvl1Day, tvl7Day, tvl30Day] =
        await Promise.all([
          tokenTracker.getQuotes15mNogaps(tokenId, YESTERDAY),
          tokenTracker.getQuotes1dNogaps(tokenId, WEEK_AGO),
          tokenTracker.getQuotes1dNogaps(tokenId, MONTH_AGO),
          tokenTracker.getActivity(tokenId, YESTERDAY),
          tokenTracker.getActivity(tokenId, WEEK_AGO),
          tokenTracker.getActivity(tokenId, MONTH_AGO)
        ]);
        
        state.tokenOverview.volumeAndPrice1Day = volumeAndPrice1Day;
        state.tokenOverview.volumeAndPrice7Day = volumeAndPrice7Day;
        state.tokenOverview.volumeAndPrice30Day = volumeAndPrice30Day;
        state.tokenOverview.tvl1Day = tvl1Day;
        state.tokenOverview.tvl7Day = tvl7Day;
        state.tokenOverview.tvl30Day = tvl30Day;
        let parsedobj = JSON.parse(JSON.stringify(state.tokenOverview))
        console.log(parsedobj)
    } catch (error) {
      console.log(error);
    }
  }
}
