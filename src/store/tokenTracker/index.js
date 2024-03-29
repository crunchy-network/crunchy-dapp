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
      const mktCapAndVolToday =
        state.overViewChart.mktCapAndVol1D[
          state.overViewChart.mktCapAndVol1D.length - 1
        ];
      return {
        tokensTracked: state.tokenList.length,
        dexCovered: 16,
        total24hVolume: state.tokenList.reduce((prev, current) => {
          return prev + current.volume24;
        }, 0),
        total24hVolumeUsd: state.tokenList.reduce((prev, current) => {
          return prev + current.volume24Usd;
        }, 0),
        estimatedMktCap: mktCapAndVolToday?.mktCap,
        estimatedMktCapUsd: mktCapAndVolToday?.mktCap * state.xtzUsd,
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
