import mutations from "./mutations";
import actions from "./actions";

export default {
  state: {
    loading: false,
    searchInput: "",
    tokenList: [],
    tokensTracked: {},
    tokenOverview: {},
  },
  mutations,
  actions,
  getters: {
    getTrackerData(state) {
      return {
        tokensTracked: state.tokenList.length,
        dexCovered: 3,
        total24hVolume: 0,
        estimatedMktCap: state.tokenList.reduce((prev, current) => {
          return prev + current.mktCap;
        }, 0),
      };
    },

    getTokenOverview(state) {
      return state.tokenOverview;
    },
  },
};
