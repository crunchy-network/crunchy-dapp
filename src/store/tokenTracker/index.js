import mutations from "./mutations";
import actions from "./actions";

export default {
  state: {
    loading: false,
    searchInput: "",
    tokenList: {},
    tokensTracked: [],
  },
  mutations,
  actions,
  getters: {
    getTrackerData(state) {
      return {
        tokensTracked: state.tokensTracked.length,
        dexCovered: 0,
        total24hVolume: 0,
        estimatedMktCap: 0,
      };
    },
  },
};
