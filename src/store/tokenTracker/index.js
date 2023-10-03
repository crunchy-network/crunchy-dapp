import mutations from "./mutations";
import actions from "./actions";

export default {
  state: {
    loading: false,
    xtzUsd: 0,
    searchInput: "",
    xtzUsdHistory: [],
    tokenList: [],
    tokensTracked: {},
    LS_FAVORITES_KEY: "FAVORITES_LIST",
    overViewChart: {
      mktCapAndVol1D: [],
      mktCapAndVol1W: [],
      mktCapAndVol1Mo: [],
    },
    tokenOverview: {
      chartData: {
        volumeAndPrice1Hour: [],
        volumeAndPrice1Day: [],
        volumeAndPrice7Day: [],
        volumeAndPrice30Day: [],
        allVolumeAndPrice: [],
        tvl1Day: [],
        tvl7Day: [],
        tvl30Day: [],
        tvlAll: [],
      },
    },
    loadingChart: false,
  },
  mutations,
  actions,
  getters: {
    getTrackerData(state) {
      return {
        tokensTracked: state.tokenList.length,
        dexCovered: 4,
        total24hVolume: state.tokenList.reduce((prev, current) => {
          if (current.tokenTvl >= 5000) {
            return prev + parseFloat(current.volume24);
          }
          return prev;
        }, 0),
        total24hVolumeUsd: state.tokenList.reduce((prev, current) => {
          if (current.tokenTvl >= 5000) {
            return prev + parseFloat(current.volume24Usd);
          }
          return prev;
        }, 0),
        estimatedMktCap: state.tokenList.reduce((prev, current) => {
          if (current.tokenTvl >= 5000) {
            return prev + parseFloat(current.mktCap);
          }
          return prev;
        }, 0),
        estimatedMktCapUsd: state.tokenList.reduce((prev, current) => {
          if (current.tokenTvl >= 5000) {
            return prev + parseFloat(current.mktCapUsd);
          }
          return prev;
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
      return state.tokenOverview.chartData;
    },

    getOverviewChart(state) {
      return state.overViewChart;
    },

    getXtzUsdPrice(state) {
      return state.xtzUsd;
    },
    getXtzUsdHistory(state) {
      return state.xtzUsdHistory;
    },
  },
};
