import _ from 'lodash'
import tzkt from './../../utils/tzkt'
import coingecko from './../../utils/coingecko'
import teztools from './../../utils/teztools'
import ipfs from './../../utils/ipfs'
import farmUtils from './../../utils/farm'
import { getTokenMetadata, getContract, getBatch, getWalletContract } from './../../utils/tezos'
import merge from 'deepmerge'
import { BigNumber } from 'bignumber.js'

export default {

  async updateXtzUsdVwap({ commit, dispatch }) {
    coingecko.getXtzUsdPrice().then(price => {
      commit('updateXtzUsdVwap', price);
      setTimeout(() => { dispatch('updateXtzUsdVwap') }, 5 * 60 * 1000);
    })
  },

  async updateCurrentPrices({ commit, dispatch }) {
    return teztools.getPricefeed().then(feed => {
      let currentPrices = {};
      for (const token of feed.contracts) {
        const tokenId = token.type === 'fa1.2' ? '0' : token.tokenId.toString();
        currentPrices[`${token.tokenAddress}_${tokenId}`] = token.currentPrice;
      }

      commit('updatePriceFeed', feed.contracts);
      commit('updateCurrentPrices', currentPrices);
      setTimeout(() => { dispatch('updateCurrentPrices') }, 60 * 1000);
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
    await dispatch('updateCurrentPrices');

    if (!state.loading && Object.keys(state.data).length === 0) {
      commit('updateFarmsLoading', true);
      tzkt.getContractBigMapKeys(state.contract, "farms")
        .then(resp => {
          let farms = {};
          for (const x of resp.data) {
            if (x.key == "13") continue; // bad catz
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
                flashFarm: ( (new Date(x.value.endTime)) - (new Date(x.value.startTime)) <= (86400 * 1000) ),
                started: (new Date(x.value.startTime) < new Date()),
                ended: (new Date(x.value.endTime) < new Date()),
                duration: (new Date(x.value.endTime) - (new Date(x.value.startTime))),
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
          dispatch('filterAllFarmRows')
        });
    }
  },

  async initFarm({ commit, state, dispatch }, farmId) {
    const farm = state.data[farmId];
    if (!farm.loading) {
      commit('updateFarm', merge(farm, { loading: true }));

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
              decimals: 6,
              tokenId: farm.poolToken.tokenId,
              realTokenAddress: poolTokenMeta.tokenAddress,
              realTokenId: poolTokenMeta.tokenId
            },
            rewardToken: { ...rewardTokenMeta, address: rewardTokenMeta.tokenAddress },
            loading: true
          }));
          dispatch('softUpdateFarm', farmId).then((f) => {
            commit('updateFarm', merge(f, { loading: false }));
          });
        } else {
          commit('updateFarm', merge(farm, {
            poolToken: { isQuipuLp: isQuipuLp, ...poolTokenMeta, address: poolTokenMeta.tokenAddress },
            rewardToken: { ...rewardTokenMeta, address: rewardTokenMeta.tokenAddress },
            loading: true
          }));
          dispatch('softUpdateFarm', farmId).then((f) => {
            commit('updateFarm', merge(f, { loading: false }));
          });
        }

      // fallback to rpc storage
      } else {
        tzkt.getContractStorage(farm.poolToken.address)
          .then(resp => {
            const isQuipuLp = Object.prototype.hasOwnProperty.call(resp.data, 'dex_lambdas') &&
              Object.prototype.hasOwnProperty.call(resp.data, 'token_lambdas');

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
                      decimals: 6,
                      realTokenAddress: resp.data.storage.token_address,
                      realTokenId: resp.data.storage.token_id
                    },
                    rewardToken: values[1],
                    loading: true
                  }));
                  dispatch('softUpdateFarm', farmId).then((f) => {
                    commit('updateFarm', merge(f, { loading: false }));
                  });
                });
            } else {
              Promise.all([
                getTokenMetadata(farm.poolToken.address, farm.poolToken.tokenId),
                getTokenMetadata(farm.rewardToken.address, farm.rewardToken.tokenId)
              ]).then(values => {
                  values[0].thumbnailUri = ipfs.transformUri(values[0].thumbnailUri);
                  values[1].thumbnailUri = ipfs.transformUri(values[1].thumbnailUri);
                  commit('updateFarm', merge(farm, {
                    poolToken: { isQuipuLp: isQuipuLp, ...values[0] },
                    rewardToken: values[1],
                    loading: true
                  }));
                  dispatch('softUpdateFarm', farmId).then((f) => {
                    commit('updateFarm', merge(f, { loading: false }));
                  });
                });
            }
          });
      }
    }
  },

  async softUpdateFarm({ commit, state, rootState, dispatch }, farmId) {
    const farm = state.data[farmId];

    if (!rootState.wallet.pkh) {
      // return tzkt.getContractBigMapKeys(farm.contract, 'farms', { key: farmId }).then(farmStorage => {
      //   let tvlTez = 0;
      //   let poolTokenStorage = teztools.findTokenInPriceFeed(farm.poolToken, state.priceFeed);
      //
      //   if (!poolTokenStorage && farm.poolToken.isQuipuLp) {
      //     poolTokenStorage = await tzkt.getContractStorage(farm.poolToken.address);
      //     tvlTez = (new BigNumber(farmStorage.poolBalance).times(poolTokenStorage.tez_pool).idiv(poolTokenStorage.total_supply)).times(2).toNumber() / 1000000;
      //   } else {
      //     if (farm.poolToken.isQuipuLp) {
      //     tvlTez = (new BigNumber(farmStorage.poolBalance).times(poolTokenStorage.tez_pool).idiv(poolTokenStorage.total_supply)).times(2).toNumber() / 1000000;
      //
      //     } else {
      //       if (Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.address}_${farm.poolToken.tokenId}`)) {
      //         tvlTez = farmStorage.poolBalance * state.currentPrices[`${farm.poolToken.address}_${farm.poolToken.tokenId}`] / (10 ** farm.poolToken.decimals);
      //       }
      //     }
      //   }
      //
      //   const multiplier = farmUtils.calcMultiplier(farm);
      //
      //   // calc rate per day
      //   let apr = "~";
      //   if (tvlTez > 0 && Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.rewardToken.address}_${farm.rewardToken.tokenId}`)) {
      //       const rewardPerDay = (farmStorage.rewardPerSec * multiplier * 86400) / (10 ** farm.rewardToken.decimals);
      //       const annualRewardTez = rewardPerDay * 365 * state.currentPrices[`${farm.rewardToken.address}_${farm.rewardToken.tokenId}`];
      //       apr = (annualRewardTez / tvlTez) * 100;
      //   }
      //
      //   commit('updateFarm', merge(farm, {
      //     poolToken: { balance: 0 },
      //     poolBalance: parseInt(farmStorage.poolBalance) / (10 ** farm.poolToken.decimals),
      //     multiplier: multiplier,
      //     tvlTez: tvlTez,
      //     apr: apr,
      //     depositAmount: 0,
      //     rewardsEarned: 0,
      //     init: true,
      //     updating: false,
      //     loading: false
      //   }));
      //
      //   setTimeout(() => { dispatch('softUpdateFarm', farmId) }, 60 * 1000);
      //
      //   dispatch('updateTotalTvlTez');
      //
      //   return state.data[farmId];
      // })
      return Promise.all([
        tzkt.getContractBigMapKeys(farm.contract, 'farms', { key: farmId }),
        tzkt.getContractStorage(farm.poolToken.address),
      ]).then(values => {
        const farmStorage = values[0].data[0].value;
        const poolTokenStorage = values[1].data.storage;

        let tvlTez = 0;
        if (farm.poolToken.isQuipuLp) {
          tvlTez = (new BigNumber(farmStorage.poolBalance).times(poolTokenStorage.tez_pool).idiv(poolTokenStorage.total_supply)).times(2).toNumber() / 1000000;
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
          poolToken: { balance: 0 },
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
        dispatch('filterAllFarmRows');

        return state.data[farmId];
      });
    }

    if (!farm.updating) {
      return Promise.all([
        farmUtils.getUserRecord(farm, rootState.wallet.pkh),
        tzkt.getContractBigMapKeys(farm.poolToken.address, 'ledger', { key: rootState.wallet.pkh, active: "true" }),
        tzkt.getContractBigMapKeys(farm.contract, 'farms', { key: farmId }),
        tzkt.getContractStorage(farm.poolToken.address),
      ]).then(values => {

        const userRecord = values[0];
        const poolTokenLedger = values[1];
        const farmStorage = values[2].data[0].value;
        const poolTokenStorage = values[3].data.storage;
        const currentRewardMultiplier = farmUtils.getCurrentRewardMultiplier(farmStorage);

        let tvlTez = 0;
        if (farm.poolToken.isQuipuLp) {
          tvlTez = (new BigNumber(farmStorage.poolBalance).times(poolTokenStorage.tez_pool).idiv(poolTokenStorage.total_supply)).times(2).toNumber() / 1000000;
        } else {
          if (Object.prototype.hasOwnProperty.call(state.currentPrices, `${farm.poolToken.address}_${farm.poolToken.tokenId}`)) {
            tvlTez = farmStorage.poolBalance * state.currentPrices[`${farm.poolToken.address}_${farm.poolToken.tokenId}`] / (10 ** farm.poolToken.decimals);
          }
        }

        let poolTokenBal = 0;
        if (poolTokenLedger.data.length) {
          if (typeof poolTokenLedger.data[0].value === 'object') {
            poolTokenBal = poolTokenLedger.data[0].value.balance;
          } else {
            poolTokenBal = poolTokenLedger.data[0].value;
          }
          poolTokenBal = poolTokenBal / (10 ** farm.poolToken.decimals);
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
          poolToken: { balance: poolTokenBal },
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
        dispatch('filterAllFarmRows');

        return state.data[farmId];
      });
    }
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

  expandFarmRow({ commit, state }, farmId) {
    commit('updateFarm', merge(state.data[farmId], { rowExpanded: true }));
  },

  collapseFarmRow({ commit, state }, farmId) {
    commit('updateFarm', merge(state.data[farmId], { rowExpanded: false }));
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

  filterAllFarmRows({ commit, state }) {
    for (const farmId in state.data) {
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

      commit('updateFarm', merge(farm, { visible: visible }));
    }
  },

  async walletConnected({ commit, state, dispatch }) {
    for (const farmId in state.data) {
      commit('updateFarm', merge(state.data[farmId], { loading: true }));
      dispatch('softUpdateFarm', farmId).then((f) => {
        commit('updateFarm', merge(f, { loading: false }));
      });
    }
  }

}
