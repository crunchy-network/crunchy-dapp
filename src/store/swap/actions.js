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
    };
    const quipuV2 = {
      "dex_address": "KT1J8Hr3BP8bpbfmgGpRPoC9nAMSYtStZG43",
      "dex_type": "quipuswap_v2",
      "params": [
        {
          "name": "interface_fee",
          "value": "500000000000000"
        },
        {
          "name": "swap_fee",
          "value": "2250000000000000"
        },
        {
          "name": "auction_fee",
          "value": "750000000000000"
        },
        {
          "name": "withdraw_fee_reward",
          "value": "0"
        },
      ],
      "pools": [
        {
          "pool_id": 1,
          "reserves": "71638270206673537168882",
          "params": [
            {
              "name": "token_a_price_cml",
              "value": "12724558330740"
            }
          ],
          "token_address": "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
          "token_id": 0,
          "token": {
            "decimals": 18,
            "symbol": "kUSD",
            "token_type": "fa1.2"
          }
        },
        {
          "pool_id": 1,
          "reserves": "64207826092",
          "params": [
            {
              "name": "token_b_price_cml",
              "value": "13592947568468295381842796258311281710"
            }
          ],
          "token_address": "tez",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "XTZ",
            "token_type": "tez"
          }
        },
        {
          "pool_id": 2,
          "reserves": "126346405570",
          "params": [
            {
              "name": "token_a_price_cml",
              "value": "4452100606443573456281415"
            }
          ],
          "token_address": "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "QUIPU",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 2,
          "reserves": "38816432384",
          "params": [
            {
              "name": "token_b_price_cml",
              "value": "38620061141844987941402310"
            }
          ],
          "token_address": "tez",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "XTZ",
            "token_type": "tez"
          }
        },
        {
          "pool_id": 0,
          "reserves": "700825082144",
          "params": [
            {
              "name": "token_a_price_cml",
              "value": "12598196221007455769190135"
            }
          ],
          "token_address": "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "USDt",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 0,
          "reserves": "623413849186",
          "params": [
            {
              "name": "token_b_price_cml",
              "value": "13682104917969214398363780"
            }
          ],
          "token_address": "tez",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "XTZ",
            "token_type": "tez"
          }
        },
        {
          "pool_id": 7,
          "reserves": "946853495",
          "params": [
            {
              "name": "token_a_price_cml",
              "value": "11991167232675718140464175"
            }
          ],
          "token_address": "KT1UG6PdaKoJcc3yD6mkFVfxnS1uJeW3cGeX",
          "token_id": 1,
          "token": {
            "decimals": 6,
            "symbol": "abBUSD",
            "token_type": "fa2"
          }
        },
        {
          "pool_id": 7,
          "reserves": "838204730",
          "params": [
            {
              "name": "token_b_price_cml",
              "value": "12491828418383857813384560"
            }
          ],
          "token_address": "tez",
          "token_id": 0,
          "token": {
            "decimals": 6,
            "symbol": "XTZ",
            "token_type": "tez"
          }
        }
      ]
    };
    dexPools.push(quipuToken2Token)
    dexPools.push(quipuV2)
    console.log(dexPools)
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
