/* eslint-disable */

import {
  buildSwapPairs,
  buildQuipuStablePairs,
} from "../../lib/SwapRouter";
import dexIndexer from "./../../utils/dex-indexer";

const modifyDexPools = (dexPools) => {
  const modifiedDexPools = dexPools.map(item => {
    return {
      dex_address: item.dex.address,
      dex_type: item.dex.type,
      params: item.params,
      pools: item.tokens.map(tokenItem => {
        return {
          pool_id: item.poolId,
          reserves: tokenItem.reserves,
          params: tokenItem.params,
          token_address: tokenItem.token.tokenAddress,
          token_id: tokenItem.token.tokenId,
          token: {
            decimals: tokenItem.token.decimals,
            symbol: tokenItem.token.symbol,
            token_type: tokenItem.token.tokenType
          }
        };
      })
    };
  });
  return modifiedDexPools;
}

export default {
  async loadTokenList(state) {
    const tokenList = await dexIndexer.getAllTokens();
    const modifiedTokenList = tokenList.map((token) => {
        const modifiedToken = {
          thumbnailUri: token.thumbnail_uri,
          type: token.token_type,
          tokenId: token.token_id,
          tokenAddress: token.token_address,
          ...token,
        }
        return modifiedToken;
    })
    state.commit("updateTokenList", modifiedTokenList);
  },
  updateTokenList({ dispatch, commit }) {
    dispatch("loadTokenList");
  },
  updateForm(state, payload) {
    state.commit("updateSwapForm", payload);
  },

  updateCurrentTrade(state, payload) {
    state.commit("updateCurrentTrade", payload);
  },

  async loadSwapPairs(state) {
    const dex = "core";
    const dexPools = await dexIndexer.getAllTokenPools();
    const modifiedDexPools = modifyDexPools(dexPools)

    state.commit("updateDexPairs", {
      dex,
      pairs: await buildSwapPairs(modifiedDexPools),
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
