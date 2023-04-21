import mutations from "./mutations";
import actions from "./actions";
export default {
  state: {
    loading: false,
    tokenList: [],
    dexList: [],
    swapForm: {
      inputToken: {},
      inputAmount: 1,
      outputToken: {},
      slippageTolerance: 0.5,
    },
    currentTrade: {},
    swapPairs: [],
    dexApis: {
      core: {
        loading: false,
        pairs: [],
      },
    },
    swapPairsNew: [],
  },
  mutations,
  actions,
  getters: {
    getTokenList: (state) => state.tokenList,
    getCurrentTrade: (state) => state.currentTrade,
    getSwapForm: (state) => state.swapForm,
    getSwapPairs: (state) => state.dexApis.core.pairs,
    getApiLoadingStatus: (state) => {
      return Object.keys(state.dexApis).map((api) => ({
        api,
        loading: state.dexApis[api].loading,
      }));
    },
    getDexApis: (state) => state.dexApis,
  },
};
