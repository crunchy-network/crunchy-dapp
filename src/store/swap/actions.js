/* eslint-disable */

import {
  buildSwapPairs,
  buildQuipuStablePairs,
} from "../../lib/SwapRouter";
import dexIndexer from "./../../utils/dex-indexer";
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
    const dexPools = await dexIndexer.getAllDexes();
    const quipuV3 = [
      {
        "dex_address": "KT1D5wP1BPNmWY61wbB7RNvkXp8EUkLv7NAe",
        "dex_type": "quipuswap_v3",
        "params": [
          {
            "name": "fee_bps",
            "value": "\"30\""
          },
          {
            "name": "factory_address",
            "value": "KT1JNNMMGyNNy36Zo6pcgRTMLUZyqRrttMZ4"
          },
          {
            "name": "sqrt_price",
            "value": "\"1.91040890576382234308635e+23\""
          },
          {
            "name": "cur_tick_index",
            "value": "\"-36900\""
          },
          {
            "name": "cur_tick_witness",
            "value": "\"-36900\""
          },
          {
            "name": "liquidity",
            "value": "\"0\""
          },
          {
            "name": "last_cumulatives_buffer",
            "value": "200"
          },
          {
            "name": "ticks",
            "value": "{\"{\\\"1048575\\\":{\\\"next\\\":\\\"1048576\\\",\\\"prev\\\":\\\"-36900\\\",\\\"sqrt_price\\\":\\\"71107673757466966990985103421469892397199512717\\\",\\\"n_positions\\\":\\\"1\\\",\\\"liquidity_net\\\":\\\"0\\\",\\\"seconds_outside\\\":\\\"0\\\",\\\"fee_growth_outside\\\":{\\\"x\\\":\\\"0\\\",\\\"y\\\":\\\"0\\\"},\\\"tick_cumulative_outside\\\":\\\"0\\\",\\\"seconds_per_liquidity_outside\\\":\\\"0\\\"}}\",\"{\\\"-1048575\\\":{\\\"next\\\":\\\"-39660\\\",\\\"prev\\\":\\\"-1048576\\\",\\\"sqrt_price\\\":\\\"20\\\",\\\"n_positions\\\":\\\"1\\\",\\\"liquidity_net\\\":\\\"0\\\",\\\"seconds_outside\\\":\\\"0\\\",\\\"fee_growth_outside\\\":{\\\"x\\\":\\\"0\\\",\\\"y\\\":\\\"0\\\"},\\\"tick_cumulative_outside\\\":\\\"0\\\",\\\"seconds_per_liquidity_outside\\\":\\\"0\\\"}}\",\"{\\\"-39660\\\":{\\\"next\\\":\\\"-36900\\\",\\\"prev\\\":\\\"-1048575\\\",\\\"sqrt_price\\\":\\\"166415469851038780193038\\\",\\\"n_positions\\\":\\\"1\\\",\\\"liquidity_net\\\":\\\"42489294319\\\",\\\"seconds_outside\\\":\\\"1676039879\\\",\\\"fee_growth_outside\\\":{\\\"x\\\":\\\"0\\\",\\\"y\\\":\\\"0\\\"},\\\"tick_cumulative_outside\\\":\\\"-64085060813444\\\",\\\"seconds_per_liquidity_outside\\\":\\\"0\\\"}}\",\"{\\\"-36900\\\":{\\\"next\\\":\\\"1048575\\\",\\\"prev\\\":\\\"-39660\\\",\\\"sqrt_price\\\":\\\"191040890576382234308635\\\",\\\"n_positions\\\":\\\"1\\\",\\\"liquidity_net\\\":\\\"-42489294319\\\",\\\"seconds_outside\\\":\\\"1678837499\\\",\\\"fee_growth_outside\\\":{\\\"x\\\":\\\"906341119901685929858839052166021005\\\",\\\"y\\\":\\\"27756970918449065038362156359844550\\\"},\\\"tick_cumulative_outside\\\":\\\"-64190744878139\\\",\\\"seconds_per_liquidity_outside\\\":\\\"22405191015838011573034853849187067\\\"}}\"}"
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "161671707",
            "params": [
              {
                "name": "dev_fee_A",
                "value": "48501539"
              },
              {
                "name": "fee_growth_A",
                "value": "906341119901685929858839052166021005"
              }
            ],
            "token_address": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
            "token_id": 2,
            "token": {
              "decimals": 12,
              "symbol": "uBTC",
              "token_type": "fa2"
            }
          },
          {
            "pool_id": 0,
            "reserves": "870444270",
            "params": [
              {
                "name": "dev_fee_B",
                "value": "1485419"
              },
              {
                "name": "fee_growth_B",
                "value": "27756970918449065038362156359844550"
              }
            ],
            "token_address": "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
            "token_id": 0,
            "token": {
              "decimals": 6,
              "symbol": "USDt",
              "token_type": "fa2"
            }
          }
        ]
      }
    ]
    for(let dex of quipuV3) {
      dexPools.push(dex);
    }

    state.commit("updateDexPairs", {
      dex,
      pairs: await buildSwapPairs(dexPools),
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
