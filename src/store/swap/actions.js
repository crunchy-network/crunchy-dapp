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
        "dex_address": "KT1Bn8Hm9dxXzPZ9YXzrdVWKoQpWBWo1DL3s",
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
            "value": "\"2.210592818757746299367974e+24\""
          },
          {
            "name": "cur_tick_index",
            "value": "\"12070\""
          },
          {
            "name": "cur_tick_witness",
            "value": "\"10260\""
          },
          {
            "name": "liquidity",
            "value": "\"44719499154\""
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "217149082",
            "params": [
              {
                "name": "dev_fee_A",
                "value": "4884874"
              },
              {
                "name": "fee_growth_A",
                "value": "188474371199202612299184926701146467"
              }
            ],
            "token_address": "KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b",
            "token_id": 0,
            "token": {
              "decimals": 6,
              "symbol": "wTEZ",
              "token_type": "fa2"
            }
          },
          {
            "pool_id": 0,
            "reserves": "959416203",
            "params": [
              {
                "name": "dev_fee_B",
                "value": "17934259"
              },
              {
                "name": "fee_growth_B",
                "value": "667210852479817400352954563916767093"
              }
            ],
            "token_address": "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb",
            "token_id": 0,
            "token": {
              "decimals": 6,
              "symbol": "QUIPU",
              "token_type": "fa2"
            }
          }
        ]
      },
      {
        "dex_address": "KT1DZZG2Neaq5FH6ARtwWrPDro1ZZiHkHRBA",
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
            "value": "\"1.124832434858298569414595e+24\""
          },
          {
            "name": "cur_tick_index",
            "value": "\"-1442\""
          },
          {
            "name": "cur_tick_witness",
            "value": "\"-1500\""
          },
          {
            "name": "liquidity",
            "value": "\"15737413235\""
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "1525155742",
            "params": [
              {
                "name": "dev_fee_A",
                "value": "86515615"
              },
              {
                "name": "fee_growth_A",
                "value": "929672633749550754855172712182251744"
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
            "reserves": "911027740",
            "params": [
              {
                "name": "dev_fee_B",
                "value": "88978692"
              },
              {
                "name": "fee_growth_B",
                "value": "806257155205785435544440373224146107"
              }
            ],
            "token_address": "KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b",
            "token_id": 0,
            "token": {
              "decimals": 6,
              "symbol": "wTEZ",
              "token_type": "fa2"
            }
          }
        ]
      },
      {
        "dex_address": "KT1SgzqTS622zLda2iAji6ewKH9rr5KoWvP1",
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
            "value": "\"6.9489877602138041627414e+22\""
          },
          {
            "name": "cur_tick_index",
            "value": "\"-57127\""
          },
          {
            "name": "cur_tick_witness",
            "value": "\"-58140\""
          },
          {
            "name": "liquidity",
            "value": "\"185537659\""
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "91509",
            "params": [
              {
                "name": "dev_fee_A",
                "value": "2935563"
              },
              {
                "name": "fee_growth_A",
                "value": "6533369038383249951128146304816935079"
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
            "reserves": "692",
            "params": [
              {
                "name": "dev_fee_B",
                "value": "16094"
              },
              {
                "name": "fee_growth_B",
                "value": "19380784487917116044379839915801617"
              }
            ],
            "token_address": "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
            "token_id": 0,
            "token": {
              "decimals": 8,
              "symbol": "tzBTC",
              "token_type": "fa1.2"
            }
          }
        ]
      },
      {
        "dex_address": "KT1RsTtKsNttsAytEt5fs8xLZBNtRieWAXBK",
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
            "value": "\"7.4625135078629280114303e+22\""
          },
          {
            "name": "cur_tick_index",
            "value": "\"-55701\""
          },
          {
            "name": "cur_tick_witness",
            "value": "\"-59340\""
          },
          {
            "name": "liquidity",
            "value": "\"4282739\""
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "24271142",
            "params": [
              {
                "name": "dev_fee_A",
                "value": "1627030"
              },
              {
                "name": "fee_growth_A",
                "value": "4799161686378338756001872797155145785"
              }
            ],
            "token_address": "KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b",
            "token_id": 0,
            "token": {
              "decimals": 6,
              "symbol": "wTEZ",
              "token_type": "fa2"
            }
          },
          {
            "pool_id": 0,
            "reserves": "164973",
            "params": [
              {
                "name": "dev_fee_B",
                "value": "5351"
              },
              {
                "name": "fee_growth_B",
                "value": "39866991089218316836981754534028056"
              }
            ],
            "token_address": "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
            "token_id": 0,
            "token": {
              "decimals": 8,
              "symbol": "tzBTC",
              "token_type": "fa1.2"
            }
          }
        ]
      },
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
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "18214575293",
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
            "reserves": "439598500",
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
      },
      {
        "dex_address": "KT1Qqa41WUJYFQZAo7EJ5DPpstZKEp9yg4ex",
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
            "value": "\"1.366156135243488743137946e+24\""
          },
          {
            "name": "cur_tick_index",
            "value": "\"2445\""
          },
          {
            "name": "cur_tick_witness",
            "value": "\"-7440\""
          },
          {
            "name": "liquidity",
            "value": "\"181081539\""
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "51887291",
            "params": [
              {
                "name": "dev_fee_B",
                "value": "25200"
              },
              {
                "name": "fee_growth_B",
                "value": "110494991844260731910647318482244459"
              }
            ],
            "token_address": "KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW",
            "token_id": 0,
            "token": {
              "decimals": 12,
              "symbol": "uUSD",
              "token_type": "fa2"
            }
          },
          {
            "pool_id": 0,
            "reserves": "33847822",
            "params": [
              {
                "name": "dev_fee_A",
                "value": "0"
              },
              {
                "name": "fee_growth_A",
                "value": "0"
              }
            ],
            "token_address": "KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL",
            "token_id": 0,
            "token": {
              "decimals": 12,
              "symbol": "YOU",
              "token_type": "fa2"
            }
          }
        ]
      },
      {
        "dex_address": "KT1KeYeWrQo2WLdtL2pyrKNG3JoJaGLE8z1V",
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
            "value": "\"1.297993246947384011222644894741e+30\""
          },
          {
            "name": "cur_tick_index",
            "value": "\"277731\""
          },
          {
            "name": "cur_tick_witness",
            "value": "\"276600\""
          },
          {
            "name": "liquidity",
            "value": "\"13508872879022395\""
          }
        ],
        "pools": [
          {
            "pool_id": 0,
            "reserves": "1460287993",
            "params": [
              {
                "name": "dev_fee_A",
                "value": "13445587"
              },
              {
                "name": "fee_growth_A",
                "value": "705054999365926871497825743666"
              }
            ],
            "token_address": "KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b",
            "token_id": 0,
            "token": {
              "decimals": 6,
              "symbol": "wTEZ",
              "token_type": "fa2"
            }
          },
          {
            "pool_id": 0,
            "reserves": "1252586414444480705807",
            "params": [
              {
                "name": "dev_fee_B",
                "value": "18224671788292672296"
              },
              {
                "name": "fee_growth_B",
                "value": "810934550742515111187513756082758939445814"
              }
            ],
            "token_address": "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
            "token_id": 0,
            "token": {
              "decimals": 18,
              "symbol": "kUSD",
              "token_type": "fa1.2"
            }
          }
        ]
      }
    ]
    for(let dex of quipuV3) {
      dexPools.push(dex);
    }
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
