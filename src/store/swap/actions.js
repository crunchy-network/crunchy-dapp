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
    const quipuToken2Token = {
      "dex_address": "KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi",
      "dex_type": "quipuswap_token2token",
      "params": [],
      "pools": [
        {
          "pool_id": 21,
          "reserves": "73980023764778715",
          "params": [],
          "token_address": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
          "token_id": 0,
          "token": {
            "decimals": 12,
            "symbol": "uUSD",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 21,
          "reserves": "2694467203985",
          "params": [],
          "token_address": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
          "token_id": 2,
          "token": {
            "decimals": 12,
            "symbol": "uBTC",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 50,
          "reserves": "7319994369456",
          "params": [],
          "token_address": "KT19DUSZw7mfeEATrbWVPHRrWNVbNnmfFAE6",
          "token_id": 0,
          "token": {
            "decimals": 8,
            "symbol": "PAUL",
            "token_type": "fa1.2"
          }
        },
        {
          "pool_id": 50,
          "reserves": "39841913",
          "params": [],
          "token_address": "KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "USDtz",
            "token_type": "fa1.2"
          }
        },
        {
          "pool_id": 53,
          "reserves": "20671160",
          "params": [],
          "token_address": "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "QUIPU",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 53,
          "reserves": "1170171275601027",
          "params": [],
          "token_address": "KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF",
          "token_id": 2,
          "token": {
            "decimals": 9,
            "symbol": "ENR",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 42,
          "reserves": "77322",
          "params": [],
          "token_address": "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
          "token_id": 0,
          "token": {
            "decimals": 8,
            "symbol": "tzBTC",
            "token_type": "fa1.2"
          }
        },
        {
          "pool_id": 42,
          "reserves": "12051869056094707",
          "params": [],
          "token_address": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
          "token_id": 20,
          "token": {
            "decimals": 18,
            "symbol": "wWETH",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 11,
          "reserves": "83165779707",
          "params": [],
          "token_address": "KT1XPFjZqCULSnqfKaaYy8hJjeY63UNSGwXg",
          "token_id": 0,
          "token": {
            "decimals": 8,
            "symbol": "crDAO",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 11,
          "reserves": "123657166896",
          "params": [],
          "token_address": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
          "token_id": 0,
          "token": {
            "decimals": 12,
            "symbol": "uUSD",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 76,
          "reserves": "74347742",
          "params": [],
          "token_address": "KT1TgmD7kXQzofpuc9VbTRMdZCS2e6JDuTtc",
          "token_id": 0,
          "token": {
            "decimals": 0,
            "symbol": "UP",
            "token_type": "fa1.2"
          }
        },
        {
          "pool_id": 76,
          "reserves": "26080206294721",
          "params": [],
          "token_address": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
          "token_id": 0,
          "token": {
            "decimals": 12,
            "symbol": "uUSD",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 25,
          "reserves": "34711",
          "params": [],
          "token_address": "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "QUIPU",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 25,
          "reserves": "21308007",
          "params": [],
          "token_address": "KT1TtaMcoSx5cZrvaVBWsFoeZ1L15cxo5AEy",
          "token_id": 0,
          "token": {
            "decimals": 4,
            "symbol": "SOIL",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 72,
          "reserves": "73108652",
          "params": [],
          "token_address": "KT1TgmD7kXQzofpuc9VbTRMdZCS2e6JDuTtc",
          "token_id": 0,
          "token": {
            "decimals": 0,
            "symbol": "UP",
            "token_type": "fa1.2"
          }
        },
        {
          "pool_id": 72,
          "reserves": "74050938",
          "params": [],
          "token_address": "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "QUIPU",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 7,
          "reserves": "2918608448",
          "params": [],
          "token_address": "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "QUIPU",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 7,
          "reserves": "1011512039763162",
          "params": [],
          "token_address": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
          "token_id": 0,
          "token": {
            "decimals": 12,
            "symbol": "uUSD",
            "token_type": "fa2"
          }
        }
      ]
    }
    dexPools.push(quipuToken2Token)
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
