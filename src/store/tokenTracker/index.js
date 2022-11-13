import mutations from "./mutations";
import actions from "./actions";

export default {
  state: {
    loading: false,
    searchInput: "",
    tokenList: [],
    tokensTracked: {},
    tokenOverview: {},
    tokensOrder: [],
  },
  mutations,
  actions,
  getters: {
    getTrackerData(state) {
      return {
        tokensTracked: Object.keys(state.tokensTracked).length,
        dexCovered: 3,
        total24hVolume: 0,
        estimatedMktCap: Object.keys(state.tokensTracked).reduce(
          (prev, current) => {
            return prev + state.tokensTracked[current].mktCap;
          },
          0
        ),
      };
    },
  },
};
