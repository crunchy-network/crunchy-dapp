import mutations from "./mutations";
import actions from "./actions";

export default {
  state: {
    loading: false,
    searchInput: "",
    tokenList: [],
    tokensTracked: {},
    tokenOverview: {
      volumeAndPrice1Day: [],
      volumeAndPrice7Day: [],
      volumeAndPrice30Day: [],
      tvl1Day: [],
      tvl7Day: [],
      tvl30Day: [],
    },
    loadingChart: false,
  },
  mutations,
  actions,
  getters: {
    getTrackerData(state) {
      return {
        tokensTracked: state.tokenList.length,
        dexCovered: 3,
        total24hVolume: state.tokenList.reduce((prev, current) => {
          return prev + current.volume1Day;
        }, 0),
        estimatedMktCap: state.tokenList.reduce((prev, current) => {
          return prev + current.mktCap;
        }, 0),
      };
    },

    getTokenOverview(state) {
      return state.tokenOverview;
    },

    getTokens(state) {
      const filteredTokens = state.tokenList.filter((token) => {
        return (
          token.name?.toLowerCase().includes(state.searchInput.toLowerCase()) ||
          token.symbol
            ?.toLowerCase()
            .includes(state.searchInput.toLowerCase()) ||
          token.tokenAddress
            ?.toLowerCase()
            .includes(state.searchInput.toLowerCase()) ||
          token.address?.toString().includes(state.searchInput.toLowerCase())
        );
      });
      return state.searchInput?.trim().length > 1
        ? filteredTokens
        : state.tokenList;
    },

    getLoadingChart(state) {
      return state.loadingChart;
    },

    getChartData(state) {
      return {
        volumeAndPrice1Day: state.tokenOverview.volumeAndPrice1Day,
        volumeAndPrice7Day: state.tokenOverview.volumeAndPrice7Day,
        volumeAndPrice30Day: state.tokenOverview.volumeAndPrice30Day,
        tvl1Day: state.tokenOverview.tvl1Day,
        tvl7Day: state.tokenOverview.tvl7Day,
        tvl30Day: state.tokenOverview.tvl30Day,
      };
    },
  },
};
