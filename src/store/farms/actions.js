import _ from "lodash";
import tzkt from "./../../utils/tzkt";
import teztools from "./../../utils/teztools";
import ipfs from "./../../utils/ipfs";
import farmUtils from "./../../utils/farm";
import {
  getTokenMetadata,
  getContract,
  getBatch,
  getWalletContract,
} from "./../../utils/tezos";
import merge from "deepmerge";
import { BigNumber } from "bignumber.js";

let updateXtzUsdVwapPromise;
let updateCurrentPricesPromise;
let updateFarmStoragePromise;

const tokenMetadataCache = {};
const getFarmTokenMetadata = async (address, tokenId) => {
  const cacheKey = `${address}:${tokenId}`;
  if (!Object.prototype.hasOwnProperty.call(tokenMetadataCache, cacheKey)) {
    let meta = await getTokenMetadata(address, tokenId).catch(() => {
      return {
        thumbnailUri: "https://static.thenounproject.com/png/796573-200.png",
      };
    });
    meta = merge(meta, { tokenAddress: address, tokenId: tokenId });
    meta = farmUtils.overrideMetadata(meta);
    if (Object.prototype.hasOwnProperty.call(meta, "thumbnailUri")) {
      meta.thumbnailUri = ipfs.transformUri(meta.thumbnailUri);
    }
    tokenMetadataCache[cacheKey] = meta;
  }
  return tokenMetadataCache[cacheKey];
};

export default {
  async _updateXtzUsdVwap({ commit, dispatch }) {
    return tzkt.getXtzUsdPrice().then((price) => {
      commit("updateXtzUsdVwap", price);
      setTimeout(() => {
        updateXtzUsdVwapPromise = dispatch("_updateXtzUsdVwap");
      }, 5 * 60 * 1000);
    });
  },

  async updateXtzUsdVwap({ dispatch }) {
    if (!updateXtzUsdVwapPromise) {
      updateXtzUsdVwapPromise = dispatch("_updateXtzUsdVwap");
    }
    return updateXtzUsdVwapPromise;
  },

  async _updateCurrentPrices({ commit, dispatch }) {
    const usdValue = await tzkt.getXtzUsdPrice();
    const tez = {
      asset: "XTZ",
      balance: 0,
      icon: "data:image/png;base64,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",
      assetSlug: "tez",
      priceUsd: usdValue,
      decimals: 6,
      usdValue,
    };
    return teztools.getPricefeed().then((feed) => {
      const currentPrices = {};
      for (const token of feed.contracts) {
        const tokenId = token.type === "fa1.2" ? "0" : token.tokenId.toString();
        currentPrices[`${token.tokenAddress}_${tokenId}`] = token.currentPrice;
      }

      commit("updatePriceFeed", [tez, ...feed.contracts]);
      commit("updateCurrentPrices", currentPrices);
      setTimeout(() => {
        updateCurrentPricesPromise = dispatch("_updateCurrentPrices");
      }, 60 * 1000);
    });
  },

  async updateCurrentPrices({ dispatch }) {
    if (!updateCurrentPricesPromise) {
      updateCurrentPricesPromise = dispatch("_updateCurrentPrices");
    }
    return updateCurrentPricesPromise;
  },

  async _updateFarmStorage({ commit, state, dispatch }) {
    return tzkt.getContractBigMapKeys(state.contract, "farms").then((resp) => {
      commit("updateFarmStorage", resp.data);
      setTimeout(() => {
        updateFarmStoragePromise = dispatch("_updateFarmStorage");
      }, 30 * 1000);
    });
  },

  async updateFarmStorage({ dispatch }) {
    if (!updateFarmStoragePromise) {
      updateFarmStoragePromise = dispatch("_updateFarmStorage");
    }
    return updateFarmStoragePromise;
  },

  async updateUserRecordStorage({ commit, state, rootState, dispatch }) {
    if (!rootState.wallet.pkh) return;
    return tzkt
      .getContractBigMapKeys(state.contract, "ledger", {
        "key.address": rootState.wallet.pkh,
        active: "true",
      })
      .then((resp) => {
        commit("updateFarmUserRecordStorage", resp.data);
        setTimeout(() => {
          dispatch("updateUserRecordStorage");
        }, 30 * 1000);
      });
  },

  async updateVaultStorage({ commit, state }) {
    return tzkt.getContractBigMap(state.contract, "vaults").then((resp) => {
      commit("updateVaultStorage", resp.data);
    });
  },

  updateTotalTvlTez({ commit, state }) {
    let total = 0;
    for (const farmId in state.data) {
      const farmTvl = Number(state.data[farmId].tvlTez);
      if (!Number.isNaN(farmTvl)) {
        total += Number(farmTvl);
      }
    }
    commit("updateTotalTvlTez", total);
  },

  async fetchAllFarms({ commit, state, dispatch }) {
    dispatch("updateXtzUsdVwap");

    if (!state.loading && Object.keys(state.data).length === 0) {
      commit("updateFarmsLoading", true);

      await Promise.allSettled([
        dispatch("updateCurrentPrices"),
        dispatch("updateFarmStorage"),
        dispatch("updateVaultStorage"),
      ]);

      const farms = {};
      for (const x of state.storage.farms) {
        if (x.key === "13") continue; // bad catz
        if (x.key === "55") continue; // bad HEH -> CLOVER

        // if (x.key > "15") continue;

        // errant farms
        let errant = false;
        if (x.key === "75") errant = true;
        if (x.key === "85") errant = true;
        if (x.key === "84") errant = true;
        if (x.key === "83") errant = true;
        if (x.key === "93") errant = true; // tz1e52CpddrybiDgawzvqRPXthy2hbAWGJba

        if (x.value.rewardPerSec === "0") errant = true;

        // Some date stuff
        const nowD = new Date();
        const startTimeD = new Date(x.value.startTime);
        const endTimeD = new Date(x.value.endTime);
        const duration = endTimeD - startTimeD;

        // baseline farm is complete check
        let isEnded = endTimeD < nowD;

        // show farms as complete that have paid out all rewards
        if (x.value.rewardPaid === x.value.rewardSupply) {
          isEnded = true;
        }

        // hide farms that have been completed with no stake left
        if (isEnded && x.value.poolBalance === "0") continue;

        // hide farms with errors and no stake left
        if (errant && x.value.poolBalance === "0") continue;

        const f = merge(
          { id: x.key, ...x.value },
          {
            contract: state.contract,
            poolToken: {
              name: "???",
              symbol: "???",
              thumbnailUri:
                "https://static.thenounproject.com/png/796573-200.png",
            },
            rewardToken: {
              name: "???",
              symbol: "???",
              thumbnailUri:
                "https://static.thenounproject.com/png/796573-200.png",
            },
            depositAmount: "~",
            rewardsEarned: "~",
            tvlTez: "~",
            apr: "~",
            multiplier: "1",
            rowExpanded: false,
            init: false,
            loading: false,
            updating: false,
            visible: true,
            errant: errant,
            flashFarm: duration <= 86400 * 1000,
            started: startTimeD < nowD,
            ended: isEnded,
            duration: duration,
            badges: {
              verified: false,
              core: false,
              partner: false,
              lpLocked: false,
            },
          }
        );
        f.badges = farmUtils.getBadges(f);
        farms[x.key] = f;
      }

      commit("updateFarmsData", farms);
      commit("updateFarmsLoading", false);

      for (const farmId in farms) {
        dispatch("initFarm", farmId);
      }

      dispatch("filterAllFarmRows");
    }
  },

  async initFarm({ commit, state, dispatch }, farmId) {
    const farm = state.data[farmId];
    if (!farm.loading) {
      commit("updateFarmLoading", { farmId, loading: true });

      let poolTokenMeta = teztools.findTokenInPriceFeed(
        farm.poolToken,
        state.priceFeed
      );

      if (poolTokenMeta) {
        const isQuipuLp = poolTokenMeta.address === farm.poolToken.address;

        let rewardTokenMeta = teztools.findTokenInPriceFeed(
          farm.rewardToken,
          state.priceFeed
        );
        if (!rewardTokenMeta) {
          rewardTokenMeta = await getFarmTokenMetadata(
            farm.rewardToken.address,
            farm.rewardToken.tokenId
          );
        }

        // allow overrides
        poolTokenMeta = farmUtils.overrideMetadata(poolTokenMeta);
        if (
          Object.prototype.hasOwnProperty.call(poolTokenMeta, "thumbnailUri")
        ) {
          poolTokenMeta.thumbnailUri = ipfs.transformUri(
            poolTokenMeta.thumbnailUri
          );
        }

        rewardTokenMeta = farmUtils.overrideMetadata(rewardTokenMeta);
        if (
          Object.prototype.hasOwnProperty.call(rewardTokenMeta, "thumbnailUri")
        ) {
          rewardTokenMeta.thumbnailUri = ipfs.transformUri(
            rewardTokenMeta.thumbnailUri
          );
        }

        if (isQuipuLp) {
          commit(
            "updateFarm",
            merge(farm, {
              poolToken: {
                ...poolTokenMeta,
                isQuipuLp: isQuipuLp,
                isLbLp: false,
                isPlentyLp: false,
                isSpicyLp: false,
                decimals: 6,
                tokenId: farm.poolToken.tokenId,
                realTokenAddress: poolTokenMeta.tokenAddress,
                realTokenId: poolTokenMeta.tokenId,
              },
              rewardToken: {
                ...rewardTokenMeta,
                address: rewardTokenMeta.tokenAddress,
              },
              rewardSupply: BigNumber(farm.rewardSupply)
                .div(10 ** rewardTokenMeta.decimals)
                .toNumber(),
              loading: true,
            })
          );
          dispatch("softUpdateFarm", farmId).then(() => {
            dispatch("updateFarmRewardsEarned", farmId);
            commit("updateFarmLoading", { farmId, loading: false });
          });
        } else {
          commit(
            "updateFarm",
            merge(farm, {
              poolToken: {
                isQuipuLp: isQuipuLp,
                isLbLp: false,
                isPlentyLp: false,
                isSpicyLp: false,
                ...poolTokenMeta,
                address: poolTokenMeta.tokenAddress,
              },
              rewardToken: {
                ...rewardTokenMeta,
                address: rewardTokenMeta.tokenAddress,
              },
              rewardSupply: BigNumber(farm.rewardSupply)
                .div(10 ** rewardTokenMeta.decimals)
                .toNumber(),
              loading: true,
            })
          );
          dispatch("softUpdateFarm", farmId).then(() => {
            dispatch("updateFarmRewardsEarned", farmId);
            commit("updateFarmLoading", { farmId, loading: false });
          });
        }

        // fallback to rpc storage
      } else {
        // Liquidity Baking
        const force = false;
        if (force || farm.poolToken.address === state.lbLpAddress) {
          Promise.all([
            tzkt.getContractStorage(state.lbDexAddress),
            getFarmTokenMetadata(state.lbLpAddress, 0),
            getFarmTokenMetadata(
              farm.rewardToken.address,
              farm.rewardToken.tokenId
            ),
          ]).then((values) => {
            const resp = values[0];
            const poolTokenMeta = values[1];
            const rewardTokenMeta = values[2];

            commit(
              "updateFarm",
              merge(farm, {
                poolToken: {
                  ...resp.data,
                  ...poolTokenMeta,
                  isQuipuLp: false,
                  isLbLp: true,
                  isPlentyLp: false,
                  isSpicyLp: false,
                  decimals: 0,
                  address: state.lbLpAddress,
                  tokenId: 0,
                  realTokenAddress: resp.data.tokenAddress,
                  realTokenId: 0,
                },
                rewardToken: rewardTokenMeta,
                rewardSupply: BigNumber(farm.rewardSupply)
                  .div(10 ** rewardTokenMeta.decimals)
                  .toNumber(),
                loading: true,
              })
            );
            dispatch("softUpdateFarm", farmId).then(() => {
              dispatch("updateFarmRewardsEarned", farmId);
              commit("updateFarmLoading", { farmId, loading: false });
            });
          });
        } else {
          tzkt.getContractStorage(farm.poolToken.address).then((resp) => {
            const isQuipuLp =
              Object.prototype.hasOwnProperty.call(resp.data, "dex_lambdas") &&
              Object.prototype.hasOwnProperty.call(resp.data, "token_lambdas");

            const isPlentyLp =
              Object.prototype.hasOwnProperty.call(
                resp.data,
                "exchangeAddress"
              ) &&
              Object.prototype.hasOwnProperty.call(resp.data, "securityCheck");

            const isSpicyLp = Object.prototype.hasOwnProperty.call(
              resp.data,
              "spiceFeeLastK"
            );

            if (isQuipuLp) {
              Promise.all([
                getFarmTokenMetadata(
                  resp.data.storage.token_address,
                  resp.data.storage.token_id || 0
                ),
                getFarmTokenMetadata(
                  farm.rewardToken.address,
                  farm.rewardToken.tokenId
                ),
              ]).then((values) => {
                commit(
                  "updateFarm",
                  merge(farm, {
                    poolToken: {
                      ...values[0],
                      isQuipuLp: isQuipuLp,
                      isLbLp: false,
                      isPlentyLp: false,
                      isSpicyLp: false,
                      decimals: 6,
                      realTokenAddress: resp.data.storage.token_address,
                      realTokenId: resp.data.storage.token_id,
                    },
                    rewardToken: values[1],
                    rewardSupply: BigNumber(farm.rewardSupply)
                      .div(10 ** values[1].decimals)
                      .toNumber(),
                    loading: true,
                  })
                );
                dispatch("softUpdateFarm", farmId).then(() => {
                  dispatch("updateFarmRewardsEarned", farmId);
                  commit("updateFarmLoading", { farmId, loading: false });
                });
              });

              // Plenty AMM
            } else if (isPlentyLp) {
              tzkt
                .getContractStorage(resp.data.exchangeAddress)
                .then((exchangeResp) => {
                  Promise.all([
                    getFarmTokenMetadata(
                      exchangeResp.data.token1Address,
                      exchangeResp.data.token1Id
                    ),
                    getFarmTokenMetadata(
                      exchangeResp.data.token2Address,
                      exchangeResp.data.token2Id
                    ),
                    getFarmTokenMetadata(
                      farm.rewardToken.address,
                      farm.rewardToken.tokenId
                    ),
                  ]).then((values) => {
                    const token1Meta = values[0];
                    const token2Meta = values[1];
                    const rewardMeta = values[2];

                    commit(
                      "updateFarm",
                      merge(farm, {
                        poolToken: {
                          isQuipuLp: false,
                          isLbLp: false,
                          isPlentyLp: true,
                          isSpicyLp: false,
                          decimals: 12,
                          name: token1Meta.name + "/" + token2Meta.name,
                          symbol: token1Meta.symbol + "/" + token2Meta.symbol,
                          token1: token1Meta,
                          token1Pool: exchangeResp.data.token1_pool,
                          token2: token2Meta,
                          token2Pool: exchangeResp.data.token2_pool,
                          totalSupply: exchangeResp.data.totalSupply,
                        },
                        rewardToken: rewardMeta,
                        rewardSupply: BigNumber(farm.rewardSupply)
                          .div(BigNumber(10).pow(rewardMeta.decimals))
                          .toNumber(),
                        loading: true,
                      })
                    );
                    dispatch("softUpdateFarm", farmId).then(() => {
                      dispatch("updateFarmRewardsEarned", farmId);
                      commit("updateFarmLoading", { farmId, loading: false });
                    });
                  });
                });

              // Spicy swap
            } else if (isSpicyLp) {
              Promise.all([
                getFarmTokenMetadata(
                  resp.data.token0.fa2_address,
                  resp.data.token0.token_id
                ),
                getFarmTokenMetadata(
                  resp.data.token1.fa2_address,
                  resp.data.token1.token_id
                ),
                getFarmTokenMetadata(
                  farm.rewardToken.address,
                  farm.rewardToken.tokenId
                ),
                tzkt.getContractBigMapKeys(
                  farm.poolToken.address,
                  "token_total_supply",
                  { key: 0, select: "value" }
                ),
              ]).then((values) => {
                const token1Meta = values[0];
                const token2Meta = values[1];
                const rewardMeta = values[2];
                const totalSupply = values[3].data[0];

                commit(
                  "updateFarm",
                  merge(farm, {
                    poolToken: {
                      isQuipuLp: false,
                      isLbLp: false,
                      isPlentyLp: false,
                      isSpicyLp: true,
                      decimals: 18,
                      name: token1Meta.name + "/" + token2Meta.name,
                      symbol: token1Meta.symbol + "/" + token2Meta.symbol,
                      token1: token1Meta,
                      token1Pool: resp.data.reserve0,
                      token2: token2Meta,
                      token2Pool: resp.data.reserve1,
                      totalSupply: totalSupply,
                    },
                    rewardToken: rewardMeta,
                    rewardSupply: BigNumber(farm.rewardSupply)
                      .div(BigNumber(10).pow(rewardMeta.decimals))
                      .toNumber(),
                    loading: true,
                  })
                );
                dispatch("softUpdateFarm", farmId).then(() => {
                  dispatch("updateFarmRewardsEarned", farmId);
                  commit("updateFarmLoading", { farmId, loading: false });
                });
              });

              // single token staking
            } else {
              Promise.all([
                getFarmTokenMetadata(
                  farm.poolToken.address,
                  farm.poolToken.tokenId
                ),
                getFarmTokenMetadata(
                  farm.rewardToken.address,
                  farm.rewardToken.tokenId
                ),
              ]).then((values) => {
                commit(
                  "updateFarm",
                  merge(farm, {
                    poolToken: {
                      isQuipuLp: false,
                      isLbLp: false,
                      isPlentyLp: false,
                      isSpicyLp: false,
                      ...values[0],
                    },
                    rewardToken: values[1],
                    rewardSupply: BigNumber(farm.rewardSupply)
                      .div(10 ** values[1].decimals)
                      .toNumber(),
                    loading: true,
                  })
                );
                dispatch("softUpdateFarm", farmId).then(() => {
                  dispatch("updateFarmRewardsEarned", farmId);
                  commit("updateFarmLoading", { farmId, loading: false });
                });
              });
            }
          });
        }
      }
    }
  },

  async softUpdateFarm({ commit, state, rootState, dispatch }, farmId) {
    const farm = state.data[farmId];

    if (!rootState.wallet.pkh) {
      const farmStorage = state.storage.farms.find(
        (f) => f.key === farmId
      ).value;

      let tvlTez = 0;
      if (farm.poolToken.isLbLp) {
        const poolK = await tzkt.getContractStorage(state.lbDexAddress);
        const poolTokenStorage = {
          tezPool: BigNumber(poolK.data.xtzPool).div(BigNumber(10).pow(6)),
          qptTokenSupply: BigNumber(poolK.data.lqtTotal),
        };

        tvlTez = BigNumber(farmStorage.poolBalance)
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2)
          .toNumber();
      } else if (farm.poolToken.isQuipuLp) {
        let poolTokenStorage = teztools.findTokenInPriceFeed(
          farm.poolToken,
          state.priceFeed
        );
        if (
          !poolTokenStorage ||
          !Object.prototype.hasOwnProperty.call(
            poolTokenStorage,
            "qptTokenSupply"
          )
        ) {
          const poolK = await tzkt.getContractStorage(farm.poolToken.address);
          poolTokenStorage = {
            tezPool: BigNumber(poolK.data.storage.tez_pool).div(
              BigNumber(10).pow(6)
            ),
            qptTokenSupply: BigNumber(poolK.data.storage.total_supply).div(
              BigNumber(10).pow(6)
            ),
          };
        }

        tvlTez = BigNumber(farmStorage.poolBalance)
          .div(BigNumber(10).pow(6))
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2)
          .toNumber();
      } else if (farm.poolToken.isPlentyLp) {
        if (
          Object.prototype.hasOwnProperty.call(
            state.currentPrices,
            `${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`
          ) &&
          Object.prototype.hasOwnProperty.call(
            state.currentPrices,
            `${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`
          )
        ) {
          const token1Price =
            state.currentPrices[
              `${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`
            ];
          const token2Price =
            state.currentPrices[
              `${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`
            ];

          const token1TotalXtz = BigNumber(farm.poolToken.token1Pool)
            .div(BigNumber(10).pow(farm.poolToken.token1.decimals))
            .times(token1Price);
          const token2TotalXtz = BigNumber(farm.poolToken.token2Pool)
            .div(BigNumber(10).pow(farm.poolToken.token2.decimals))
            .times(token2Price);
          const xtzPerLp = token1TotalXtz
            .plus(token2TotalXtz)
            .div(farm.poolToken.totalSupply);
          tvlTez = BigNumber(farmStorage.poolBalance)
            .times(xtzPerLp)
            .toNumber();
        }
      } else {
        if (
          Object.prototype.hasOwnProperty.call(
            state.currentPrices,
            `${farm.poolToken.address}_${farm.poolToken.tokenId}`
          )
        ) {
          tvlTez =
            (farmStorage.poolBalance *
              state.currentPrices[
                `${farm.poolToken.address}_${farm.poolToken.tokenId}`
              ]) /
            10 ** farm.poolToken.decimals;
        }
      }

      const multiplier = farmUtils.calcMultiplier(farm);

      // calc rate per day
      let apr = "~";
      if (
        tvlTez > 0 &&
        Object.prototype.hasOwnProperty.call(
          state.currentPrices,
          `${farm.rewardToken.address}_${farm.rewardToken.tokenId}`
        )
      ) {
        const rewardPerDay =
          (farmStorage.rewardPerSec * multiplier * 86400) /
          10 ** farm.rewardToken.decimals;
        const annualRewardTez =
          rewardPerDay *
          365 *
          state.currentPrices[
            `${farm.rewardToken.address}_${farm.rewardToken.tokenId}`
          ];
        apr = (annualRewardTez / tvlTez) * 100;
      }

      commit(
        "updateFarm",
        merge(farm, {
          poolBalance:
            parseInt(farmStorage.poolBalance) / 10 ** farm.poolToken.decimals,
          multiplier: multiplier,
          tvlTez: tvlTez,
          apr: apr,
          depositAmount: 0,
          rewardsEarned: 0,
          init: true,
          updating: false,
          loading: false,
        })
      );

      setTimeout(() => {
        dispatch("softUpdateFarm", farmId);
      }, 60 * 1000);

      dispatch("updateTotalTvlTez");
      dispatch("filterFarmRow", farmId);

      return state.data[farmId];
    }

    if (!farm.updating) {
      const userRecord = farmUtils.getUserRecord(
        farm,
        state.storage.userRecords
      );
      const farmStorage = state.storage.farms.find(
        (f) => f.key === farmId
      ).value;
      const currentRewardMultiplier =
        farmUtils.getCurrentRewardMultiplier(farmStorage);

      let tvlTez = 0;
      if (farm.poolToken.isLbLp) {
        const poolK = await tzkt.getContractStorage(state.lbDexAddress);
        const poolTokenStorage = {
          tezPool: BigNumber(poolK.data.xtzPool).div(BigNumber(10).pow(6)),
          qptTokenSupply: BigNumber(poolK.data.lqtTotal),
        };

        tvlTez = BigNumber(farmStorage.poolBalance)
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2)
          .toNumber();
      } else if (farm.poolToken.isQuipuLp) {
        let poolTokenStorage = teztools.findTokenInPriceFeed(
          farm.poolToken,
          state.priceFeed
        );
        if (
          !poolTokenStorage ||
          !Object.prototype.hasOwnProperty.call(
            poolTokenStorage,
            "qptTokenSupply"
          )
        ) {
          const poolK = await tzkt.getContractStorage(farm.poolToken.address);
          poolTokenStorage = {
            tezPool: BigNumber(poolK.data.storage.tez_pool).div(
              BigNumber(10).pow(6)
            ),
            qptTokenSupply: BigNumber(poolK.data.storage.total_supply).div(
              BigNumber(10).pow(6)
            ),
          };
        }

        tvlTez = BigNumber(farmStorage.poolBalance)
          .div(BigNumber(10).pow(6))
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2)
          .toNumber();
      } else if (farm.poolToken.isPlentyLp) {
        if (
          Object.prototype.hasOwnProperty.call(
            state.currentPrices,
            `${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`
          ) &&
          Object.prototype.hasOwnProperty.call(
            state.currentPrices,
            `${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`
          )
        ) {
          const token1Price =
            state.currentPrices[
              `${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`
            ];
          const token2Price =
            state.currentPrices[
              `${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`
            ];

          const token1TotalXtz = BigNumber(farm.poolToken.token1Pool)
            .div(BigNumber(10).pow(farm.poolToken.token1.decimals))
            .times(token1Price);
          const token2TotalXtz = BigNumber(farm.poolToken.token2Pool)
            .div(BigNumber(10).pow(farm.poolToken.token2.decimals))
            .times(token2Price);
          const xtzPerLp = token1TotalXtz
            .plus(token2TotalXtz)
            .div(farm.poolToken.totalSupply);
          tvlTez = BigNumber(farmStorage.poolBalance)
            .times(xtzPerLp)
            .toNumber();
        }
      } else {
        if (
          Object.prototype.hasOwnProperty.call(
            state.currentPrices,
            `${farm.poolToken.address}_${farm.poolToken.tokenId}`
          )
        ) {
          tvlTez =
            (farmStorage.poolBalance *
              state.currentPrices[
                `${farm.poolToken.address}_${farm.poolToken.tokenId}`
              ]) /
            10 ** farm.poolToken.decimals;
        }
      }

      const multiplier = farmUtils.calcMultiplier(farm);

      // calc rate per day
      let apr = "~";
      if (
        tvlTez > 0 &&
        Object.prototype.hasOwnProperty.call(
          state.currentPrices,
          `${farm.rewardToken.address}_${farm.rewardToken.tokenId}`
        )
      ) {
        const rewardPerDay =
          (farmStorage.rewardPerSec * multiplier * 86400) /
          10 ** farm.rewardToken.decimals;
        const annualRewardTez =
          rewardPerDay *
          365 *
          state.currentPrices[
            `${farm.rewardToken.address}_${farm.rewardToken.tokenId}`
          ];
        apr = (annualRewardTez / tvlTez) * 100;
      }

      commit(
        "updateFarm",
        merge(farm, {
          poolBalance:
            parseInt(farmStorage.poolBalance) / 10 ** farm.poolToken.decimals,
          tvlTez: tvlTez,
          multiplier: multiplier,
          apr: apr,
          depositAmount: userRecord.amount,
          rewardsEarned:
            farmUtils
              .estimatePendingRewards(
                userRecord,
                farmStorage,
                currentRewardMultiplier
              )
              .toNumber() /
            10 ** farm.rewardToken.decimals,
          init: true,
          updating: false,
        })
      );

      setTimeout(() => {
        dispatch("softUpdateFarm", farmId);
      }, 30 * 1000);

      dispatch("updateTotalTvlTez");
      dispatch("filterFarmRow", farmId);

      return state.data[farmId];
    }
  },

  async updateFarmRewardsEarned(
    { state, rootState, commit, dispatch },
    farmId
  ) {
    const farm = state.data[farmId];
    if (rootState.wallet.pkh) {
      const userRecord = farmUtils.getUserRecord(
        farm,
        state.storage.userRecords
      );
      if (userRecord.amount > 0) {
        const farmStorage = state.storage.farms.find(
          (f) => f.key === farmId
        ).value;
        const currentRewardMultiplier =
          farmUtils.getCurrentRewardMultiplier(farmStorage);
        const pendingRewards = farmUtils.estimatePendingRewards(
          userRecord,
          farmStorage,
          currentRewardMultiplier
        );
        const rewardsEarned = pendingRewards
          .div(BigNumber(10).pow(farm.rewardToken.decimals))
          .toNumber();
        commit("updateFarmRewardsEarned", { farmId, rewardsEarned });
      }
    }

    setTimeout(() => {
      dispatch("updateFarmRewardsEarned", farmId);
    }, 1 * 1000);
  },

  async getPoolTokenBalance({ state, rootState }, farmId) {
    const farm = state.data[farmId];
    const poolTokenBal = await tzkt.getTokenBalance(
      rootState.wallet.pkh,
      farm.poolToken.address,
      farm.poolToken.tokenId
    );
    return poolTokenBal
      .div(new BigNumber(10).pow(farm.poolToken.decimals))
      .toNumber();
  },

  async stakeInFarm({ commit, dispatch, state, rootState }, payload) {
    const { farmId, amount } = payload;
    const farm = state.data[farmId];
    const farmContract = await getContract(farm.contract);
    const poolTokenContract = await getContract(farm.poolToken.address);
    const amountB = BigNumber(amount)
      .times(10 ** farm.poolToken.decimals)
      .idiv(1)
      .toNumber();

    const batch = await getBatch()
      .withContractCall(
        farmUtils.isFa2(farm.poolToken)
          ? poolTokenContract.methods.update_operators([
              {
                add_operator: {
                  owner: rootState.wallet.pkh,
                  operator: farm.contract,
                  token_id: farm.poolToken.tokenId,
                },
              },
            ])
          : poolTokenContract.methods.approve(farm.contract, amountB)
      )
      .withContractCall(farmContract.methods.deposit(farmId, amountB))
      .withContractCall(
        farmUtils.isFa2(farm.poolToken)
          ? poolTokenContract.methods.update_operators([
              {
                remove_operator: {
                  owner: rootState.wallet.pkh,
                  operator: farm.contract,
                  token_id: farm.poolToken.tokenId,
                },
              },
            ])
          : poolTokenContract.methods.approve(farm.contract, 0)
      );

    batch.send().then((tx) => {
      commit("updateFarm", merge(farm, { loading: true }));
      tx.confirmation().then(() => {
        dispatch("softUpdateFarm", farmId).then((f) => {
          commit("updateFarm", merge(f, { loading: false }));
        });
      });
    });
  },

  async unstakeFromFarm({ commit, state, dispatch }, payload) {
    const { farmId, amount } = payload;
    const farm = state.data[farmId];
    const farmContract = await getWalletContract(farm.contract);
    const amountB = BigNumber(amount)
      .times(10 ** farm.poolToken.decimals)
      .idiv(1)
      .toNumber();

    farmContract.methods
      .withdraw(farmId, amountB)
      .send()
      .then((tx) => {
        commit("updateFarm", merge(farm, { loading: true }));
        tx.confirmation().then(() => {
          dispatch("softUpdateFarm", farmId).then((f) => {
            commit("updateFarm", merge(f, { loading: false }));
          });
        });
      });
  },

  async harvestFarm({ commit, state, dispatch }, farmId) {
    const farm = state.data[farmId];
    const farmContract = await getWalletContract(farm.contract);
    farmContract.methods
      .harvest(farmId)
      .send()
      .then((tx) => {
        commit("updateFarm", merge(farm, { loading: true }));
        tx.confirmation().then(() => {
          dispatch("softUpdateFarm", farmId).then((f) => {
            commit("updateFarm", merge(f, { loading: false }));
          });
        });
      });
  },

  async harvestAllFarms({ commit, state, dispatch }) {
    const farmContract = await getContract(state.contract);
    const batch = getBatch();
    const harvestingFarms = [];
    for (const farmId in state.data) {
      if (state.data[farmId].depositAmount && state.data[farmId].started) {
        harvestingFarms.push(farmId);
        batch.withContractCall(farmContract.methods.harvest(farmId));
      }
    }

    batch.send().then((tx) => {
      harvestingFarms.map((farmId) => {
        commit("updateFarm", merge(state.data[farmId], { loading: true }));
      });
      tx.confirmation().then(() => {
        harvestingFarms.map((farmId) => {
          dispatch("softUpdateFarm", farmId).then((f) => {
            commit("updateFarm", merge(f, { loading: false }));
          });
        });
      });
    });
  },

  async createFarm({ state, rootState }, params) {
    const farmContract = await getContract(state.contract);
    const crnchy = await getContract(state.crnchyAddress);
    const rewardToken = await getContract(params.rewardToken.tokenAddress);

    let prevM = 0;
    const bonuses = [];
    for (const b of _.orderBy(params.bonuses, "endTime", "desc")) {
      const m = parseInt(b.multiplier);
      bonuses.push({ endTime: b.endTime.toISOString(), multiplier: m - prevM });
      prevM = m;
    }

    const batch = await getBatch()
      .withContractCall(
        crnchy.methods.update_operators([
          {
            add_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: 0,
            },
          },
        ])
      )
      .withContractCall(
        params.rewardToken.tokenType === "fa2"
          ? rewardToken.methods.update_operators([
              {
                add_operator: {
                  owner: rootState.wallet.pkh,
                  operator: state.contract,
                  token_id: params.rewardToken.tokenId,
                },
              },
            ])
          : rewardToken.methods.approve(
              state.contract,
              params.rewardSupplyApprove
            )
      )
      .withContractCall(
        farmContract.methods.create(
          // poolToken
          params.poolToken.tokenAddress,
          params.poolToken.tokenId,
          params.poolToken.tokenType,
          "unit",

          // rewardToken
          params.rewardToken.tokenAddress,
          params.rewardToken.tokenId,
          params.rewardToken.tokenType,
          "unit",

          // rewardSupply
          params.rewardSupply,

          // rewardPerSec
          params.rewardPerSec,

          // startTime, endTime
          params.startTime.toISOString(),
          params.endTime.toISOString(),

          // lockDuration
          params.lockDuration,

          // bonuses
          _.orderBy(bonuses, "endTime", "asc"),

          // serviceFeeId
          params.serviceFeeId
        )
      )
      .withContractCall(
        params.rewardToken.tokenType === "fa2"
          ? rewardToken.methods.update_operators([
              {
                remove_operator: {
                  owner: rootState.wallet.pkh,
                  operator: state.contract,
                  token_id: params.rewardToken.tokenId,
                },
              },
            ])
          : rewardToken.methods.approve(state.contract, 0)
      )
      .withContractCall(
        crnchy.methods.update_operators([
          {
            remove_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: 0,
            },
          },
        ])
      );

    const tx = await batch.send();
    return tx.confirmation();
  },

  expandFarmRow({ commit }, farmId) {
    commit("updateFarmRowExpanded", { farmId, rowExpanded: true });
  },

  collapseFarmRow({ commit }, farmId) {
    commit("updateFarmRowExpanded", { farmId, rowExpanded: false });
  },

  expandAllFarmRows({ commit, state, dispatch }) {
    for (const farmId in state.data) {
      dispatch("expandFarmRow", farmId);
    }
    commit("updateFarmsExpanded", true);
  },

  collapseAllFarmRows({ commit, state, dispatch }) {
    for (const farmId in state.data) {
      dispatch("collapseFarmRow", farmId);
    }
    commit("updateFarmsExpanded", false);
  },

  filterFarmRow({ commit, state }, farmId) {
    const farm = state.data[farmId];
    const userFarm = state.userData[farmId] || undefined;

    // keyword search
    let keywordsMatch = true;
    if (state.searchInput.length) {
      if (
        farm.poolToken.symbol
          .toLowerCase()
          .includes(state.searchInput.toLowerCase()) ||
        farm.poolToken.name
          .toLowerCase()
          .includes(state.searchInput.toLowerCase()) ||
        farm.rewardToken.symbol
          .toLowerCase()
          .includes(state.searchInput.toLowerCase()) ||
        farm.rewardToken.name
          .toLowerCase()
          .includes(state.searchInput.toLowerCase())
      ) {
        keywordsMatch = true;
      } else {
        keywordsMatch = false;
      }
    }

    // farm type filter
    let typeMatches = true;
    if (
      state.filters.includes("farm") ||
      state.filters.includes("garden") ||
      state.filters.includes("flash")
    ) {
      typeMatches = false;

      if (!farm.flashFarm) {
        if (
          state.filters.includes("farm") &&
          (farm.tvlTez >= 10000 || farm.badges.core === true)
        ) {
          typeMatches = true;
        }

        if (
          state.filters.includes("garden") &&
          (farm.tvlTez < 10000 || farm.badges.core === true)
        ) {
          typeMatches = true;
        }
      }

      if (state.filters.includes("flash") && farm.flashFarm) {
        typeMatches = true;
      }
    }

    // staked filters
    // let stakedMatches = true;
    // if (state.filters.includes("staked") && farm.depositAmount <= 0) {
    //   stakedMatches = false;
    // }

    // status filters
    let statusMatches = true;
    if (
      state.filters.includes("pending") ||
      state.filters.includes("running") ||
      state.filters.includes("ended")
    ) {
      statusMatches = false;

      if (state.filters.includes("pending") && !farm.started) {
        statusMatches = true;
      }

      if (state.filters.includes("running") && farm.started && !farm.ended) {
        statusMatches = true;
      }

      if (state.filters.includes("ended") && farm.ended) {
        statusMatches = true;
      }
    }

    // farm badges filter
    let badgeMatches = true;
    if (
      state.filters.includes("verified") ||
      state.filters.includes("core") ||
      state.filters.includes("partner") ||
      state.filters.includes("lpLocked")
    ) {
      badgeMatches = false;

      for (const b of ["verified", "core", "partner", "lpLocked"]) {
        if (state.filters.includes(b) && farm.badges[b] === true) {
          badgeMatches = true;
        }
      }
    }

    // all groups must match
    const visible =
      keywordsMatch &&
      typeMatches &&
      // stakedMatches &&
      statusMatches &&
      badgeMatches;

    commit("updateFarmVisible", { farmId, visible });

    // Update userFarm
    if (userFarm) {
      // keyword search
      let keywordsMatch = true;
      if (state.searchInput.length) {
        if (
          userFarm.poolToken.symbol
            .toLowerCase()
            .includes(state.searchInput.toLowerCase()) ||
          userFarm.poolToken.name
            .toLowerCase()
            .includes(state.searchInput.toLowerCase()) ||
          userFarm.rewardToken.symbol
            .toLowerCase()
            .includes(state.searchInput.toLowerCase()) ||
          userFarm.rewardToken.name
            .toLowerCase()
            .includes(state.searchInput.toLowerCase())
        ) {
          keywordsMatch = true;
        } else {
          keywordsMatch = false;
        }
      }

      // farm type filter
      let typeMatches = true;
      if (
        state.filters.includes("farm") ||
        state.filters.includes("garden") ||
        state.filters.includes("flash")
      ) {
        typeMatches = false;

        if (!userFarm.flashFarm) {
          if (
            state.filters.includes("farm") &&
            (userFarm.tvlTez >= 10000 || userFarm.badges.core === true)
          ) {
            typeMatches = true;
          }

          if (
            state.filters.includes("garden") &&
            (userFarm.tvlTez < 10000 || userFarm.badges.core === true)
          ) {
            typeMatches = true;
          }
        }

        if (state.filters.includes("flash") && userFarm.flashFarm) {
          typeMatches = true;
        }
      }

      // staked filters
      let stakedMatches = true;
      if (state.filters.includes("staked") && userFarm.depositAmount <= 0) {
        stakedMatches = false;
      }

      // status filters
      let statusMatches = true;
      if (
        state.filters.includes("pending") ||
        state.filters.includes("running") ||
        state.filters.includes("ended")
      ) {
        statusMatches = false;

        if (state.filters.includes("pending") && !userFarm.started) {
          statusMatches = true;
        }

        if (
          state.filters.includes("running") &&
          userFarm.started &&
          !userFarm.ended
        ) {
          statusMatches = true;
        }

        if (state.filters.includes("ended") && userFarm.ended) {
          statusMatches = true;
        }
      }

      // farm badges filter
      let badgeMatches = true;
      if (
        state.filters.includes("verified") ||
        state.filters.includes("core") ||
        state.filters.includes("partner") ||
        state.filters.includes("lpLocked")
      ) {
        badgeMatches = false;

        for (const b of ["verified", "core", "partner", "lpLocked"]) {
          if (state.filters.includes(b) && userFarm.badges[b] === true) {
            badgeMatches = true;
          }
        }
      }

      // all groups must match
      const visible =
        keywordsMatch &&
        typeMatches &&
        stakedMatches &&
        statusMatches &&
        badgeMatches;

      commit("updateUserFarmVisible", { farmId, visible });
    }
  },

  filterAllFarmRows({ state, dispatch }) {
    for (const farmId in state.data) {
      dispatch("filterFarmRow", farmId);
    }
  },

  async walletConnected({ commit, state, dispatch }) {
    await dispatch("updateUserRecordStorage");
    for (const farmId in state.data) {
      commit("updateFarmLoading", { farmId, loading: true });
      dispatch("softUpdateFarm", farmId).then(() => {
        commit("updateFarmLoading", { farmId, loading: false });
      });
    }
  },
};
