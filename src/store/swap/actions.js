/* eslint-disable */

import {
  buildSwapPairsFromPriceData,
  buildVortexPairs,
  buildSpicyPairs,
  buildWtzPairs,
  buildYouvesPairs,
  buildPlentyStablePairs,
} from "../../lib/SwapRouter";
import teztools from "./../../utils/teztools";
import vortex from "./../../utils/vortex";
import spicy from "./../../utils/spicy";
import youves from "../../utils/youves";
import plenty from "../../utils/plenty";
export default {
  updateForm(state, payload) {
    state.commit("updateSwapForm", payload);
  },
  updateCurrentTrade(state, payload) {
    state.commit("updateCurrentTrade", payload);
  },

  async loadTezToolsSwapPairs(state) {
    const dex = "tezTools";
    const priceFeed = await teztools.getPricefeed();
    state.commit("updateDexPairs", {
      dex,
      pairs: buildSwapPairsFromPriceData(priceFeed.contracts),
    });
    state.commit("updateDexLoading", { dex, loading: false });
  },

  async loadVortexSwapPairs(state) {
    const dex = "vortex";
    const pools = await vortex.getTradingPools();
    state.commit("updateDexPairs", {
      dex,
      pairs: buildVortexPairs(pools),
    });
    state.commit("updateDexLoading", { dex, loading: false });
  },

  async loadSpicySwapPairs(state) {
    const dex = "spicy";
    const pools = await spicy.getTradingPoolsAndTokens();
    state.commit("updateDexPairs", {
      dex,
      pairs: buildSpicyPairs(pools),
    });
    state.commit("updateDexLoading", { dex, loading: false });
  },

  async loadWtzSwapPairs(state) {
    const dex = "WTZ";
    await state.dispatch("loadWtzData").then(() => {
      state.commit("updateDexPairs", {
        dex,
        pairs: buildWtzPairs(state.rootState.wtz),
      });
      state.commit("updateDexLoading", { dex, loading: false });
    });
  },
  async loadYouvesSwapPairs(state) {
    const dex = "Youves";
    const pools = await youves.getTradingPools();
    state.commit("updateDexPairs", {
      dex,
      pairs: buildYouvesPairs(pools),
    });
    state.commit("updateDexLoading", { dex, loading: false });
  },

  async loadPlentyStablePairs(state){
    const dex = "Plenty";
    const pools = await plenty.getPlentyStableDexes();
    state.commit("updateDexPairs", {
      dex,
      pairs: buildPlentyStablePairs(pools),
    });
    state.commit("updateDexLoading", { dex, loading: false });
  },

  updateDexApis({ dispatch, commit }) {
    commit("updateDexLoading", { dex: "tezTools", loading: true });
    commit("updateDexLoading", { dex: "vortex", loading: true });
    commit("updateDexLoading", { dex: "spicy", loading: true });
    commit("updateDexLoading", { dex: "WTZ", loading: true });
    commit("updateDexLoading", { dex: "Youves", loading: true });
    commit("updateDexLoading", { dex: "Plenty", loading: true });
    dispatch("loadTezToolsSwapPairs");
    dispatch("loadVortexSwapPairs");
    dispatch("loadSpicySwapPairs");
    dispatch("loadWtzSwapPairs");
    dispatch("loadYouvesSwapPairs");
    dispatch("loadPlentyStablePairs");
  },
  walletConnected({ dispatch }) {
    dispatch("updateDexApis");
  },
};
// get price data
// convert to route pairs
// store route pairs in state
// get route pairs from state
// use in swap form.
