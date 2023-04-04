/* eslint-disable */

import {
  buildSwapPairs,
  buildQuipuStablePairs,
} from "../../lib/SwapRouter";
import dexIndexer from "./../../utils/dex-indexer";
export default {
  updateForm(state, payload) {
    state.commit("updateSwapForm", payload);
  },

  updateCurrentTrade(state, payload) {
    state.commit("updateCurrentTrade", payload);
  },

  async loadSwapPairs(state) {
    const dex = "core";
    const dexPools = await dexIndexer.getAllDexes();

    state.commit("updateDexPairs", {
      dex,
      pairs: buildSwapPairs(dexPools),
    });
    state.commit("updateDexLoading", { dex, loading: false });
  },

  async loadQuipuStablePairs(state){
    const dex = "QuipuStable";
    const pools = await quipuStable.getQuipuswapStableDexes();
    state.commit("updateDexPairs", {
      dex,
      pairs: buildQuipuStablePairs(pools),
    });
    state.commit("updateDexLoading", { dex, loading: false });
  },

  updateDexApis({ dispatch, commit }) {
    commit("updateDexLoading", { dex: "core", loading: true });
    dispatch("loadSwapPairs");
  },

  walletConnected({ dispatch }) {
    dispatch("updateDexApis");
  },
};
// get price data
// convert to route pairsisLoading
// store route pairs in state
// get route pairs from state
// use in swap form.
