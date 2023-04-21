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
            "name": "ticks",
            "value": "381510"
          },
          {
            "name": "last_cumulatives_buffer",
            "value": "200"
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
