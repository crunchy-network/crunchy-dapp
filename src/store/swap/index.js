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
      slippageTolerance: 1.5,
    },
    currentTrade: {},
    swapPairs: [],
    dexApis: {
      tezTools: {
        loading: false,
        pairs: [],
      },
      vortex: {
        loading: false,
        pairs: [],
      },
      spicy: {
        loading: false,
        pairs: [],
      },
      WTZ: {
        loading: false,
        pairs: [],
      },
      Youves: {
        loading: false,
        pairs: [],
      },
      Plenty: {
        loading: false,
        pairs: [],
      },
    },
    swapPairsNew: [],
  },
  mutations,
  actions,
  getters: {
    getCurrentTrade: (state) => state.currentTrade,
    getSwapForm: (state) => state.swapForm,
    getSwapPairs: (state) => {
      const apis = state.dexApis;
      return [
        ...apis.tezTools.pairs,
        ...apis.vortex.pairs,
        ...apis.spicy.pairs,
        ...apis.WTZ.pairs,
        ...apis.Youves.pairs,
        ...apis.Plenty.pairs,
      ];
    },
    getApiLoadingStatus: (state) => {
      return Object.keys(state.dexApis).map((api) => ({
        api,
        loading: state.dexApis[api].loading,
      }));
    },
    getDexApis: (state) => state.dexApis,
  },
};
