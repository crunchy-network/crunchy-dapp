import _ from 'lodash'
import tzkt from './../../utils/tzkt'
import coingecko from './../../utils/coingecko'
import teztools from './../../utils/teztools'
import ipfs from './../../utils/ipfs'
import farmUtils from './../../utils/farm'
import { getTokenMetadata, getContract, getBatch, getWalletContract } from './../../utils/tezos'
import merge from 'deepmerge'
import { BigNumber } from 'bignumber.js'

let updateXtzUsdVwapPromise = undefined;
let updateCurrentPricesPromise = undefined;
let updateFarmStoragePromise = undefined;

export default {

  async _updateXtzUsdVwap({ commit, dispatch }) {
    return coingecko.getXtzUsdPrice().then(price => {
      commit('updateXtzUsdVwap', price);
      setTimeout(() => { updateXtzUsdVwapPromise = dispatch('_updateXtzUsdVwap') }, 5 * 60 * 1000);
    })
  },

  async updateXtzUsdVwap({ dispatch }) {
    if (!updateXtzUsdVwapPromise) {
      updateXtzUsdVwapPromise = dispatch('_updateXtzUsdVwap');
    }
    return updateXtzUsdVwapPromise;
  },

  async _updateCurrentPrices({ commit, dispatch }) {
    return teztools.getPricefeed().then(feed => {
      let currentPrices = {};
      for (const token of feed.contracts) {
        const tokenId = token.type === 'fa1.2' ? '0' : token.tokenId.toString();
        currentPrices[`${token.tokenAddress}_${tokenId}`] = token.currentPrice;
      }

      commit('updatePriceFeed', feed.contracts);
      commit('updateCurrentPrices', currentPrices);
      setTimeout(() => { updateCurrentPricesPromise = dispatch('_updateCurrentPrices') }, 60 * 1000);
    });
  },

  async updateCurrentPrices({ dispatch }) {
    if (!updateCurrentPricesPromise) {
      updateCurrentPricesPromise = dispatch('_updateCurrentPrices');
    }
    return updateCurrentPricesPromise;
  },

  async _updateFarmStorage({ commit, state, dispatch }) {
    return tzkt.getContractBigMapKeys(state.contract, "farms")
      .then(resp => {
        commit('updateFarmStorage', resp.data);
        setTimeout(() => { updateFarmStoragePromise = dispatch('_updateFarmStorage') }, 30 * 1000);
      });
  },

  async updateFarmStorage({ dispatch }) {
    if (!updateFarmStoragePromise) {
      updateFarmStoragePromise = dispatch('_updateFarmStorage');
    }
    return updateFarmStoragePromise;
  },

  async updateUserRecordStorage({ commit, state, rootState, dispatch }) {
    if (!rootState.wallet.pkh) return;
    return tzkt.getContractBigMapKeys(state.contract, "ledger", { 'key.address': rootState.wallet.pkh, 'active': 'true' })
      .then(resp => {
        commit('updateFarmUserRecordStorage', resp.data);
        setTimeout(() => { dispatch('updateUserRecordStorage') }, 30 * 1000);
      });
  },

  async updateVaultStorage({ commit, state }) {
    return tzkt.getContractBigMap(state.contract, "vaults")
      .then(resp => {
        commit('updateVaultStorage', resp.data);
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
    commit('updateTotalTvlTez', total);
  },

  async fetchAllFarms({ commit, state, dispatch }) {
    dispatch('updateXtzUsdVwap');

    if (!state.loading && Object.keys(state.data).length === 0) {
      commit('updateFarmsLoading', true);

      await Promise.allSettled([
        dispatch('updateCurrentPrices'),
        dispatch('updateFarmStorage'),
        dispatch('updateVaultStorage')
      ]);

      let farms = {};
      for (const x of state.storage.farms) {
        if (x.key == "13") continue; // bad catz
        if (x.key == "55") continue; // bad HEH -> CLOVER

        //if (x.key > "15") continue;

        // errant farms
        let errant = false;
        if (x.key == "75") errant = true;
        if (x.key == "85") errant = true;
        if (x.key == "84") errant = true;
        if (x.key == "83") errant = true;
        if (x.key == "93") errant = true; // tz1e52CpddrybiDgawzvqRPXthy2hbAWGJba

        if (x.value.rewardPerSec == "0") errant = true;

        // Some date stuff
        const nowD = new Date();
        const startTimeD = new Date(x.value.startTime);
        const endTimeD = new Date(x.value.endTime);
        const duration = endTimeD - startTimeD;

        // baseline farm is complete check
        let isEnded = (endTimeD < nowD);

        // show farms as complete that have paid out all rewards
        if (x.value.rewardPaid == x.value.rewardSupply) {
          isEnded = true;
        }

        // hide farms that have been completed with no stake left
        if (isEnded && x.value.poolBalance == "0") continue;

        // hide farms with errors and no stake left
        if (errant && x.value.poolBalance == "0") continue;

        const f = merge({ id: x.key, ...x.value },
          {
            contract: state.contract,
            poolToken: { "name": "???", "symbol": "???", thumbnailUri: "https://static.thenounproject.com/png/796573-200.png" },
            rewardToken: { "name": "???", "symbol": "???", thumbnailUri: "https://static.thenounproject.com/png/796573-200.png" },
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
            flashFarm: (duration <= (86400 * 1000)),
            started: (startTimeD < nowD),
            ended: isEnded,
            duration: duration,
            badges: {
              verified: false,
              core: false,
              partner: false,
              lpLocked: false
            }
          }
        );
        f.badges = farmUtils.getBadges(f);
        farms[x.key] = f;
      }

      commit('updateFarmsData', farms);
      commit('updateFarmsLoading', false);

      for (const farmId in farms) {
        dispatch('initFarm', farmId);
      }

      dispatch('filterAllFarmRows');
    }
  },

  async initFarm({ commit, state, dispatch }, farmId) {
    const farm = state.data[farmId];
    if (!farm.loading) {
      commit('updateFarmLoading', { farmId, loading: true });

      let poolTokenMeta = teztools.findTokenInPriceFeed(farm.poolToken, state.priceFeed);

      if (poolTokenMeta) {
        const isQuipuLp = poolTokenMeta.address === farm.poolToken.address;

        let rewardTokenMeta = teztools.findTokenInPriceFeed(farm.rewardToken, state.priceFeed);
        if (!rewardTokenMeta) {
          rewardTokenMeta = await getTokenMetadata(farm.rewardToken.address, farm.rewardToken.tokenId);
          rewardTokenMeta.tokenAddress = farm.rewardToken.address;
          rewardTokenMeta.tokenId = farm.rewardToken.tokenId;
        }

        // allow overrides
        poolTokenMeta = farmUtils.overrideMetadata(poolTokenMeta);
        rewardTokenMeta = farmUtils.overrideMetadata(rewardTokenMeta);

        poolTokenMeta.thumbnailUri = ipfs.transformUri(poolTokenMeta.thumbnailUri);
        rewardTokenMeta.thumbnailUri = ipfs.transformUri(rewardTokenMeta.thumbnailUri);

        if (isQuipuLp) {
          commit('updateFarm', merge(farm, {
            poolToken: {
              ...poolTokenMeta,
              isQuipuLp: isQuipuLp,
              isLbLp: false,
              isPlentyLp: false,
              decimals: 6,
              tokenId: farm.poolToken.tokenId,
              realTokenAddress: poolTokenMeta.tokenAddress,
              realTokenId: poolTokenMeta.tokenId
            },
            rewardToken: { ...rewardTokenMeta, address: rewardTokenMeta.tokenAddress },
            rewardSupply: BigNumber(farm.rewardSupply).div(10 ** rewardTokenMeta.decimals).toNumber(),
            loading: true
          }));
          dispatch('softUpdateFarm', farmId).then(() => {
            dispatch('updateFarmRewardsEarned', farmId);
            commit('updateFarmLoading', { farmId, loading: false });
          });
        } else {
          commit('updateFarm', merge(farm, {
            poolToken: { isQuipuLp: isQuipuLp, isLbLp: false, isPlentyLp: false, ...poolTokenMeta, address: poolTokenMeta.tokenAddress },
            rewardToken: { ...rewardTokenMeta, address: rewardTokenMeta.tokenAddress },
            rewardSupply: BigNumber(farm.rewardSupply).div(10 ** rewardTokenMeta.decimals).toNumber(),
            loading: true
          }));
          dispatch('softUpdateFarm', farmId).then(() => {
            dispatch('updateFarmRewardsEarned', farmId);
            commit('updateFarmLoading', { farmId, loading: false });
          });
        }

      // fallback to rpc storage
      } else {

        // Liquidity Baking
        const force = false;
        if (force || farm.poolToken.address === state.lbLpAddress) {

          Promise.all([
            tzkt.getContractStorage(state.lbDexAddress),
            getTokenMetadata(state.lbLpAddress, 0)
              .catch(() => { return { tokenAddress: state.lbLpAddress, tokenId: 0 } }),
            getTokenMetadata(farm.rewardToken.address, farm.rewardToken.tokenId)
          ]).then(values => {
            let resp = values[0];
            let poolTokenMeta = values[1];
            let rewardTokenMeta = values[2];

            // allow overrides
            poolTokenMeta = farmUtils.overrideMetadata(poolTokenMeta);
            rewardTokenMeta = farmUtils.overrideMetadata(rewardTokenMeta);

            poolTokenMeta.thumbnailUri = ipfs.transformUri(poolTokenMeta.thumbnailUri);
            rewardTokenMeta.thumbnailUri = ipfs.transformUri(rewardTokenMeta.thumbnailUri);

            commit('updateFarm', merge(farm, {
              poolToken: {
                ...resp.data,
                ...poolTokenMeta,
                isQuipuLp: false,
                isLbLp: true,
                isPlentyLp: false,
                decimals: 0,
                address: state.lbLpAddress,
                tokenId: 0,
                realTokenAddress: resp.data.tokenAddress,
                realTokenId: 0
              },
              rewardToken: rewardTokenMeta,
              rewardSupply: BigNumber(farm.rewardSupply).div(10 ** rewardTokenMeta.decimals).toNumber(),
              loading: true
            }));
            dispatch('softUpdateFarm', farmId).then(() => {
              dispatch('updateFarmRewardsEarned', farmId);
              commit('updateFarmLoading', { farmId, loading: false });
            });
          });

        } else {
          tzkt.getContractStorage(farm.poolToken.address)
            .then(resp => {
              const isQuipuLp = Object.prototype.hasOwnProperty.call(resp.data, 'dex_lambdas') &&
                Object.prototype.hasOwnProperty.call(resp.data, 'token_lambdas');

              const isPlentyLp = Object.prototype.hasOwnProperty.call(resp.data, 'exchangeAddress') &&
                Object.prototype.hasOwnProperty.call(resp.data, 'securityCheck');

              if (isQuipuLp) {
                Promise.all([
                  getTokenMetadata(resp.data.storage.token_address, resp.data.storage.token_id || 0)
                    .catch(() => { return { thumbnailUri: "https://static.thenounproject.com/png/796573-200.png" } }),
                  getTokenMetadata(farm.rewardToken.address, farm.rewardToken.tokenId)
                ]).then(values => {
                    values[0].thumbnailUri = ipfs.transformUri(values[0].thumbnailUri);
                    values[1].thumbnailUri = ipfs.transformUri(values[1].thumbnailUri);
                    commit('updateFarm', merge(farm, {
                      poolToken: {
                        ...values[0],
                        isQuipuLp: isQuipuLp,
                        isLbLp: false,
                        isPlentyLp: false,
                        decimals: 6,
                        realTokenAddress: resp.data.storage.token_address,
                        realTokenId: resp.data.storage.token_id
                      },
                      rewardToken: values[1],
                      rewardSupply: BigNumber(farm.rewardSupply).div(10 ** values[1].decimals).toNumber(),
                      loading: true
                    }));
                    dispatch('softUpdateFarm', farmId).then(() => {
                      dispatch('updateFarmRewardsEarned', farmId);
                      commit('updateFarmLoading', { farmId, loading: false });
                    });
                  });

              // Plenty AMM
              } else if (isPlentyLp) {
                  tzkt.getContractStorage(resp.data.exchangeAddress)
                    .then(exchangeResp => {
                      Promise.all([
                        getTokenMetadata(exchangeResp.data.token1Address, exchangeResp.data.token1Id)
                          .catch(() => { return {
                            tokenAddress: exchangeResp.data.token1Address,
                            tokenId: exchangeResp.data.token1Id,
                            thumbnailUri: "https://static.thenounproject.com/png/796573-200.png"
                          }}),
                        getTokenMetadata(exchangeResp.data.token2Address, exchangeResp.data.token2Id)
                          .catch(() => { return {
                            tokenAddress: exchangeResp.data.token2Address,
                            tokenId: exchangeResp.data.token2Id,
                            thumbnailUri: "https://static.thenounproject.com/png/796573-200.png"
                          }}),
                        getTokenMetadata(farm.rewardToken.address, farm.rewardToken.tokenId)
                      ]).then(values => {
                        const token1Meta = farmUtils.overrideMetadata(values[0]);
                        const token2Meta = farmUtils.overrideMetadata(values[1]);
                        const rewardMeta = farmUtils.overrideMetadata(values[2]);

                        token1Meta.thumbnailUri = ipfs.transformUri(token1Meta.thumbnailUri);
                        token2Meta.thumbnailUri = ipfs.transformUri(token2Meta.thumbnailUri);
                        rewardMeta.thumbnailUri = ipfs.transformUri(rewardMeta.thumbnailUri);

                        commit('updateFarm', merge(farm, {
                          poolToken: {
                            isQuipuLp: false,
                            isLbLp: false,
                            isPlentyLp: true,
                            decimals: 12,
                            name: token1Meta.name + '/' + token2Meta.name,
                            symbol: token1Meta.symbol + '/' + token2Meta.symbol,
                            token1: token1Meta,
                            token1Pool: exchangeResp.data.token1_pool,
                            token2: token2Meta,
                            token2Pool: exchangeResp.data.token2_pool,
                            totalSupply: exchangeResp.data.totalSupply
                          },
                          rewardToken: rewardMeta,
                          rewardSupply: BigNumber(farm.rewardSupply).div(BigNumber(10).pow(rewardMeta.decimals)).toNumber(),
                          loading: true
                        }));
                        dispatch('softUpdateFarm', farmId).then(() => {
                          dispatch('updateFarmRewardsEarned', farmId);
                          commit('updateFarmLoading', { farmId, loading: false });
                        });
                      });
                    });

              // single token staking
              } else {
                Promise.all([
                  getTokenMetadata(farm.poolToken.address, farm.poolToken.tokenId),
                  getTokenMetadata(farm.rewardToken.address, farm.rewardToken.tokenId)
                ]).then(values => {
                    values[0].thumbnailUri = ipfs.transformUri(values[0].thumbnailUri);
                    values[1].thumbnailUri = ipfs.transformUri(values[1].thumbnailUri);
                    commit('updateFarm', merge(farm, {
                      poolToken: { isQuipuLp: false, isLbLp: false, isPlentyLp: false, ...values[0] },
                      rewardToken: values[1],
                      rewardSupply: BigNumber(farm.rewardSupply).div(10 ** values[1].decimals).toNumber(),
                      loading: true
                    }));
                    dispatch('softUpdateFarm', farmId).then(() => {
                      dispatch('updateFarmRewardsEarned', farmId);
                      commit('updateFarmLoading', { farmId, loading: false });
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
      const farmStorage = state.storage.farms.find(f => f.key == farmId).value;

      let tvlTez = 0;
      if (farm.poolToken.isLbLp) {
        const poolK = await tzkt.getContractStorage(state.lbDexAddress);
        const poolTokenStorage = {
          tezPool: BigNumber(poolK.data.xtzPool).div(BigNumber(10).pow(6)),
          qptTokenSupply: BigNumber(poolK.data.lqtTotal)
        };

        tvlTez = BigNumber(farmStorage.poolBalance)
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2).toNumber();

      } else if (farm.poolToken.isQuipuLp) {
        let poolTokenStorage = teztools.findTokenInPriceFeed(farm.poolToken, state.priceFeed);
        if (!poolTokenStorage || !Object.prototype.hasOwnProperty.call(poolTokenStorage, 'qptTokenSupply')) {
          const poolK = await tzkt.getContractStorage(farm.poolToken.address);
          poolTokenStorage = {
            tezPool: BigNumber(poolK.data.storage.tez_pool).div(BigNumber(10).pow(6)),
            qptTokenSupply: BigNumber(poolK.data.storage.total_supply).div(BigNumber(10).pow(6))
          };
        }

        tvlTez = BigNumber(farmStorage.poolBalance)
          .div(BigNumber(10).pow(6))
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2).toNumber();

      } else if (farm.poolToken.isPlentyLp) {
        if (
          Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`) &&
          Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`)
        ) {
          const token1Price = state.currentPrices[`${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`];
          const token2Price = state.currentPrices[`${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`];

          const token1TotalXtz = BigNumber(farm.poolToken.token1Pool).div(BigNumber(10).pow(farm.poolToken.token1.decimals)).times(token1Price);
          const token2TotalXtz = BigNumber(farm.poolToken.token2Pool).div(BigNumber(10).pow(farm.poolToken.token2.decimals)).times(token2Price);
          const xtzPerLp = token1TotalXtz.plus(token2TotalXtz).div(farm.poolToken.totalSupply);
          tvlTez = BigNumber(farmStorage.poolBalance).times(xtzPerLp).toNumber();
        }

      } else {
        if (Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.address}_${farm.poolToken.tokenId}`)) {
          tvlTez = farmStorage.poolBalance * state.currentPrices[`${farm.poolToken.address}_${farm.poolToken.tokenId}`] / (10 ** farm.poolToken.decimals);
        }
      }

      const multiplier = farmUtils.calcMultiplier(farm);

      // calc rate per day
      let apr = "~";
      if (tvlTez > 0 && Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.rewardToken.address}_${farm.rewardToken.tokenId}`)) {
          const rewardPerDay = (farmStorage.rewardPerSec * multiplier * 86400) / (10 ** farm.rewardToken.decimals);
          const annualRewardTez = rewardPerDay * 365 * state.currentPrices[`${farm.rewardToken.address}_${farm.rewardToken.tokenId}`];
          apr = (annualRewardTez / tvlTez) * 100;
      }

      commit('updateFarm', merge(farm, {
        poolBalance: parseInt(farmStorage.poolBalance) / (10 ** farm.poolToken.decimals),
        multiplier: multiplier,
        tvlTez: tvlTez,
        apr: apr,
        depositAmount: 0,
        rewardsEarned: 0,
        init: true,
        updating: false,
        loading: false
      }));

      setTimeout(() => { dispatch('softUpdateFarm', farmId) }, 60 * 1000);

      dispatch('updateTotalTvlTez');
      dispatch('filterFarmRow', farmId);

      return state.data[farmId];
    }

    if (!farm.updating) {
      const userRecord = farmUtils.getUserRecord(farm, state.storage.userRecords);
      const farmStorage = state.storage.farms.find(f => f.key == farmId).value;
      const currentRewardMultiplier = farmUtils.getCurrentRewardMultiplier(farmStorage);

      let tvlTez = 0;
      if (farm.poolToken.isLbLp) {
        const poolK = await tzkt.getContractStorage(state.lbDexAddress);
        const poolTokenStorage = {
          tezPool: BigNumber(poolK.data.xtzPool).div(BigNumber(10).pow(6)),
          qptTokenSupply: BigNumber(poolK.data.lqtTotal)
        };

        tvlTez = BigNumber(farmStorage.poolBalance)
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2).toNumber();

      } else if (farm.poolToken.isQuipuLp) {
        let poolTokenStorage = teztools.findTokenInPriceFeed(farm.poolToken, state.priceFeed);
        if (!poolTokenStorage || !Object.prototype.hasOwnProperty.call(poolTokenStorage, 'qptTokenSupply')) {
          const poolK = await tzkt.getContractStorage(farm.poolToken.address);
          poolTokenStorage = {
            tezPool: BigNumber(poolK.data.storage.tez_pool).div(BigNumber(10).pow(6)),
            qptTokenSupply: BigNumber(poolK.data.storage.total_supply).div(BigNumber(10).pow(6))
          };
        }

        tvlTez = BigNumber(farmStorage.poolBalance)
          .div(BigNumber(10).pow(6))
          .times(poolTokenStorage.tezPool)
          .div(poolTokenStorage.qptTokenSupply)
          .times(2).toNumber();

      } else if (farm.poolToken.isPlentyLp) {
        if (
          Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`) &&
          Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`)
        ) {
          const token1Price = state.currentPrices[`${farm.poolToken.token1.tokenAddress}_${farm.poolToken.token1.tokenId}`];
          const token2Price = state.currentPrices[`${farm.poolToken.token2.tokenAddress}_${farm.poolToken.token2.tokenId}`];

          const token1TotalXtz = BigNumber(farm.poolToken.token1Pool).div(BigNumber(10).pow(farm.poolToken.token1.decimals)).times(token1Price);
          const token2TotalXtz = BigNumber(farm.poolToken.token2Pool).div(BigNumber(10).pow(farm.poolToken.token2.decimals)).times(token2Price);
          const xtzPerLp = token1TotalXtz.plus(token2TotalXtz).div(farm.poolToken.totalSupply);
          tvlTez = BigNumber(farmStorage.poolBalance).times(xtzPerLp).toNumber();
        }

      } else {
        if (Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.address}_${farm.poolToken.tokenId}`)) {
          tvlTez = farmStorage.poolBalance * state.currentPrices[`${farm.poolToken.address}_${farm.poolToken.tokenId}`] / (10 ** farm.poolToken.decimals);
        }
      }

      const multiplier = farmUtils.calcMultiplier(farm);

      // calc rate per day
      let apr = "~";
      if (tvlTez > 0 && Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.rewardToken.address}_${farm.rewardToken.tokenId}`)) {
        const rewardPerDay = (farmStorage.rewardPerSec * multiplier * 86400) / (10 ** farm.rewardToken.decimals);
        const annualRewardTez = rewardPerDay * 365 * state.currentPrices[`${farm.rewardToken.address}_${farm.rewardToken.tokenId}`];
        apr = (annualRewardTez / tvlTez) * 100;
      }

      commit('updateFarm', merge(farm, {
        poolBalance: parseInt(farmStorage.poolBalance) / (10 ** farm.poolToken.decimals),
        tvlTez: tvlTez,
        multiplier: multiplier,
        apr: apr,
        depositAmount: userRecord.amount,
        rewardsEarned: farmUtils.estimatePendingRewards(userRecord, farmStorage, currentRewardMultiplier).toNumber() / (10 ** farm.rewardToken.decimals),
        init: true,
        updating: false
      }));

      setTimeout(() => { dispatch('softUpdateFarm', farmId) }, 30 * 1000);

      dispatch('updateTotalTvlTez');
      dispatch('filterFarmRow', farmId);

      return state.data[farmId];
    }
  },

  async updateFarmRewardsEarned({ state, rootState, commit, dispatch }, farmId) {
    const farm = state.data[farmId];
    if (rootState.wallet.pkh) {
      const userRecord = farmUtils.getUserRecord(farm, state.storage.userRecords);
      if (userRecord.amount > 0) {
        const farmStorage = state.storage.farms.find(f => f.key == farmId).value;
        const currentRewardMultiplier = farmUtils.getCurrentRewardMultiplier(farmStorage);
        const pendingRewards = farmUtils.estimatePendingRewards(userRecord, farmStorage, currentRewardMultiplier);
        const rewardsEarned = pendingRewards.div(BigNumber(10).pow(farm.rewardToken.decimals)).toNumber();
        commit('updateFarmRewardsEarned', { farmId, rewardsEarned });
      }
    }

    setTimeout(() => { dispatch('updateFarmRewardsEarned', farmId) }, 1 * 1000);
  },

  async getPoolTokenBalance({ state, rootState }, farmId) {
    const farm = state.data[farmId];
    return tzkt.getContractBigMapKeys(
      farm.poolToken.address,
      farmUtils.getTokenLedgerKey(farm.poolToken.address),
      { key: rootState.wallet.pkh, active: "true" }
    ).then(poolTokenLedger => {
      let poolTokenBal = 0;
      if (poolTokenLedger.data.length) {
        if (typeof poolTokenLedger.data[0].value === 'object') {
          poolTokenBal = poolTokenLedger.data[0].value.balance;
        } else {
          poolTokenBal = poolTokenLedger.data[0].value;
        }
        poolTokenBal = poolTokenBal / (10 ** farm.poolToken.decimals);
      }
      return poolTokenBal;
    });
  },

  async stakeInFarm({ commit, dispatch, state, rootState }, payload) {
    const { farmId, amount } = payload;
    const farm = state.data[farmId];
    const farmContract = await getContract(farm.contract);
    const poolTokenContract = await getContract(farm.poolToken.address);
    const amountB = BigNumber(amount).times(10 ** farm.poolToken.decimals).idiv(1).toNumber();

    const batch = await getBatch()
      .withContractCall(
        farmUtils.isFa2(farm.poolToken) ? poolTokenContract.methods.update_operators([
          {
            add_operator: {
              owner: rootState.wallet.pkh,
              operator: farm.contract,
              token_id: farm.poolToken.tokenId
            }
          }
        ]) : poolTokenContract.methods.approve(farm.contract, amountB)
      )
      .withContractCall(
        farmContract.methods.deposit(farmId, amountB)
      )
      .withContractCall(
        farmUtils.isFa2(farm.poolToken) ? poolTokenContract.methods.update_operators([
          {
            remove_operator: {
              owner: rootState.wallet.pkh,
              operator: farm.contract,
              token_id: farm.poolToken.tokenId
            }
          }
        ]) : poolTokenContract.methods.approve(farm.contract, 0)
      );

      batch.send().then(tx => {
        commit('updateFarm', merge(farm, { loading: true }));
        tx.confirmation().then(() => {
          dispatch('softUpdateFarm', farmId).then((f) => {
            commit('updateFarm', merge(f, { loading: false }));
          });
        })
      });
  },

  async unstakeFromFarm({ commit, state, dispatch }, payload) {
    const { farmId, amount } = payload;
    const farm = state.data[farmId];
    const farmContract = await getWalletContract(farm.contract);
    const amountB = BigNumber(amount).times(10 ** farm.poolToken.decimals).idiv(1).toNumber();

    farmContract.methods
      .withdraw(farmId, amountB)
      .send().then(tx => {
        commit('updateFarm', merge(farm, { loading: true }));
        tx.confirmation().then(() => {
          dispatch('softUpdateFarm', farmId).then((f) => {
            commit('updateFarm', merge(f, { loading: false }));
          });
        });
      });
  },

  async harvestFarm({ commit, state, dispatch }, farmId) {
    const farm = state.data[farmId];
    const farmContract = await getWalletContract(farm.contract);
    farmContract.methods
      .harvest(farmId)
      .send().then(tx => {
        commit('updateFarm', merge(farm, { loading: true }));
        tx.confirmation().then(() => {
          dispatch('softUpdateFarm', farmId).then((f) => {
            commit('updateFarm', merge(f, { loading: false }));
          });
        });
      });
  },

  async harvestAllFarms({ commit, state, dispatch }) {
    const farmContract = await getContract(state.contract);
    const batch = getBatch();
    let harvestingFarms = [];
    for (const farmId in state.data) {
      if (state.data[farmId].depositAmount && state.data[farmId].started) {
        harvestingFarms.push(farmId)
        batch.withContractCall(
          farmContract.methods.harvest(farmId)
        );
      }
    }

    batch.send().then(tx => {
      harvestingFarms.map(farmId => { commit('updateFarm', merge(state.data[farmId], { loading: true })) });
      tx.confirmation().then(() => {
        harvestingFarms.map(farmId => {
          dispatch('softUpdateFarm', farmId).then((f) => {
            commit('updateFarm', merge(f, { loading: false }));
          });
        });
      });
    });
  },

  async createFarm({ state, rootState }, params) {
    const farmContract = await getContract(state.contract);
    const crunch = await getContract(state.crunchAddress);
    const rewardToken = await getContract(params.rewardToken.tokenAddress);

    let prevM = 0;
    let bonuses = [];
    for (const b of _.orderBy(params.bonuses, 'endTime', 'desc')) {
      const m = parseInt(b.multiplier);
      bonuses.push({ endTime: b.endTime.toISOString(), multiplier: m - prevM });
      prevM = m;
    }

    const batch = await getBatch()
      .withContractCall(
        crunch.methods.update_operators([
          {
            add_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: 0
            }
          }
        ])
      )
      .withContractCall(
        params.rewardToken.tokenType === "fa2" ? rewardToken.methods.update_operators([
          {
            add_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: params.rewardToken.tokenId
            }
          }
        ]) : rewardToken.methods.approve(state.contract, params.rewardSupplyApprove)
      )
      .withContractCall(
        farmContract.methods.create(
      
          // poolToken
          params.poolToken.tokenAddress, params.poolToken.tokenId, params.poolToken.tokenType, "unit",
          
          // rewardToken
          params.rewardToken.tokenAddress, params.rewardToken.tokenId, params.rewardToken.tokenType, "unit",
          
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
          _.orderBy(bonuses, 'endTime', 'asc'),
          
          // serviceFeeId
          params.serviceFeeId
        )
      )
      .withContractCall(
        params.rewardToken.tokenType === "fa2" ? rewardToken.methods.update_operators([
          {
            remove_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: params.rewardToken.tokenId
            }
          }
        ]) : rewardToken.methods.approve(state.contract, 0)
      );

    const tx = await batch.send();
    return tx.confirmation();
  },

  expandFarmRow({ commit }, farmId) {
    commit('updateFarmRowExpanded', { farmId, rowExpanded: true });
  },

  collapseFarmRow({ commit }, farmId) {
    commit('updateFarmRowExpanded', { farmId, rowExpanded: false });
  },

  expandAllFarmRows({ commit, state, dispatch }) {
    for (const farmId in state.data) {
      dispatch('expandFarmRow', farmId);
    }
    commit('updateFarmsExpanded', true);
  },

  collapseAllFarmRows({ commit, state, dispatch }) {
    for (const farmId in state.data) {
      dispatch('collapseFarmRow', farmId);
    }
    commit('updateFarmsExpanded', false);
  },

  filterFarmRow({ commit, state }, farmId) {
    const farm = state.data[farmId];

    // keyword search
    let keywordsMatch = true;
    if (state.searchInput.length) {
      if (farm.poolToken.symbol.toLowerCase().includes(state.searchInput.toLowerCase()) ||
        farm.poolToken.name.toLowerCase().includes(state.searchInput.toLowerCase()) ||
        farm.rewardToken.symbol.toLowerCase().includes(state.searchInput.toLowerCase()) ||
        farm.rewardToken.name.toLowerCase().includes(state.searchInput.toLowerCase())
      ) {
        keywordsMatch = true;
      } else {
        keywordsMatch = false;
      }
    }

    // farm type filter
    let typeMatches = true;
    if (state.filters.includes('farm') || state.filters.includes('garden') || state.filters.includes('flash')) {
      typeMatches = false;

      if (!farm.flashFarm) {
        if (state.filters.includes('farm') && farm.tvlTez >= 10000) {
          typeMatches = true;
        }

        if (state.filters.includes('garden') && farm.tvlTez < 10000) {
          typeMatches = true;
        }
      }

      if (state.filters.includes('flash') && farm.flashFarm) {
        typeMatches = true;
      }
    }

    // staked filters
    let stakedMatches = true;
    if (state.filters.includes('staked') && farm.depositAmount <= 0) {
      stakedMatches = false;
    }

    // status filters
    let statusMatches = true;
    if (state.filters.includes('pending') || state.filters.includes('running') || state.filters.includes('ended')) {
      statusMatches = false;

      if (state.filters.includes('pending') && !farm.started) {
        statusMatches = true;
      }

      if (state.filters.includes('running') && farm.started && !farm.ended) {
        statusMatches = true;
      }

      if (state.filters.includes('ended') && farm.ended) {
        statusMatches = true;
      }
    }

    // farm badges filter
    let badgeMatches = true;
    if (state.filters.includes('verified') || state.filters.includes('core') || state.filters.includes('partner') || state.filters.includes('lpLocked')) {
      badgeMatches = false;

      for (const b of ['verified', 'core', 'partner', 'lpLocked']) {
        if (state.filters.includes(b) && farm.badges[b] === true) {
          badgeMatches = true;
        }
      }
    }

    // all groups must match
    const visible = keywordsMatch && typeMatches && stakedMatches && statusMatches && badgeMatches;

    commit('updateFarmVisible', { farmId, visible });
  },

  filterAllFarmRows({ state, dispatch }) {
    for (const farmId in state.data) {
      dispatch('filterFarmRow', farmId);
    }
  },

  async walletConnected({ commit, state, dispatch }) {
    await dispatch('updateUserRecordStorage');
    for (const farmId in state.data) {
      commit('updateFarmLoading', { farmId, loading: true });
      dispatch('softUpdateFarm', farmId).then(() => {
        commit('updateFarmLoading', { farmId, loading: false });
      });
    }
  }

}
