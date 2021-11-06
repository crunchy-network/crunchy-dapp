import tzkt from './../../utils/tzkt'
import { getWalletContract } from './../../utils/tezos'
import { BigNumber } from 'bignumber.js'

export default {

  async updateIfoStorage({ state }) {
    return tzkt.getContractStorage(state.contracts.pixel)
      .then(resp => {
        return resp.data;
      });
  },

  async updateIfoUserRecord({ state, rootState }) {
    if (!rootState.wallet.pkh) return;
    return tzkt.getContractBigMapKeys(state.contracts.pixel, "ledger", { 'key': rootState.wallet.pkh, 'active': 'true' })
      .then(resp => {
        return resp.data.length ? resp.data[0] : null;
      });
  },

  async loadIfoData({ state, commit, dispatch }) {
    if (!state.loading) {
      commit('updateIfoLoading', true);
      dispatch('softUpdateIfo').then(() => {
        commit('updateIfoLoading', false);
      });
    }
  },

  async softUpdateIfo({ commit, dispatch, state }) {
    const storage = await dispatch('updateIfoStorage');
    const userRecordStorage = await dispatch('updateIfoUserRecord');

    // Some date stuff
    const nowD = new Date();
    const startTimeD = new Date(storage.ifo.startTime);
    const endTimeD = new Date(storage.ifo.endTime);
    const harvestTimeD = new Date(storage.ifo.harvestTime);
    const isEnded = (endTimeD < nowD);
    const isHarvesting = (harvestTimeD < nowD);

    let userRecord = state.data.userRecord;

    if (userRecordStorage) {
      const dividend = BigNumber.max(storage.ifo.totalRaised, storage.ifo.raisingGoal);
      userRecord.committed = BigNumber(userRecordStorage.value.amount).div(BigNumber(10).pow(6)).toNumber();
      userRecord.committedPercent = BigNumber(userRecordStorage.value.amount).div(dividend).times(100).toNumber();
      userRecord.amountHarvested = BigNumber(userRecordStorage.value.amountHarvested).div(dividend).times(BigNumber(storage.ifo.offeringSupply)).div(BigNumber(10).pow(6)).toNumber();
      userRecord.lastHarvest = new Date(userRecordStorage.value.lastHarvest);
      userRecord.projectedHarvest = BigNumber(userRecordStorage.value.amount).div(dividend).times(BigNumber(storage.ifo.offeringSupply)).div(BigNumber(10).pow(6)).toNumber();
      userRecord.projectedFee = userRecord.committed;
      if (BigNumber(storage.ifo.totalRaised).gt(storage.ifo.raisingGoal)) {
        userRecord.projectedFee = BigNumber(userRecordStorage.value.amount).div(dividend).times(BigNumber(storage.ifo.raisingGoal)).div(BigNumber(10).pow(6)).toNumber();
      }
    } else {
      userRecord = {
        committed: 0,
        committedPercent: 0,
        projectedHarvest: 0,
        projectedFee: 0,
        amountHarvested: 0,
        pendingHarvest: 0,
        lastHarvest: ""
      };
    }

    commit('updateIfoData', {
      raisingGoal: BigNumber(storage.ifo.raisingGoal).div(BigNumber(10).pow(6)).toNumber(),
      totalRaised: BigNumber(storage.ifo.totalRaised).div(BigNumber(10).pow(6)).toNumber(),
      offeringSupply: BigNumber(storage.ifo.offeringSupply).div(BigNumber(10).pow(6)).toNumber(),
      swapRate: BigNumber(storage.ifo.raisingGoal).div(BigNumber(storage.ifo.offeringSupply)).toNumber(),
      startTime: storage.ifo.startTime,
      endTime: storage.ifo.endTime,
      started: (startTimeD < nowD),
      harvestTime: storage.ifo.harvestTime,
      ended: isEnded,
      harvesting: isHarvesting,
      harvestDuration: parseInt(storage.ifo.harvestDuration),
      userRecord: userRecord
    });

    if (!isEnded) {
      setTimeout(() => { dispatch('softUpdateIfo') }, 30 * 1000);
    }

    if (isHarvesting && userRecord.committed > 0 && userRecord.amountHarvested < userRecord.projectedHarvest && userRecord.pendingHarvest === 0) {
      setTimeout(() => { dispatch('updatePendingHarvest') }, 1 * 1000);
    }
  },

  async updatePendingHarvest({ commit, dispatch, state }) {
    const nowD = new Date();
    const harvestTimeD = new Date(state.data.harvestTime);
    const harvestEndTimeD = new Date(harvestTimeD.getTime() + (state.data.harvestDuration * 1000));
    const isHarvestingEnded = (harvestEndTimeD < nowD);
    const isHarvesting = (harvestTimeD < nowD);

    let userRecord = state.data.userRecord;

    if (isHarvestingEnded) {
      state.data.userRecord.pendingHarvest = userRecord.projectedHarvest - userRecord.amountHarvested;
      return commit('updateIfoData', state.data);
    }

    const harvestPerSec = userRecord.projectedHarvest / state.data.harvestDuration;
    const numSec = (nowD - userRecord.lastHarvest) / 1000;
    userRecord.pendingHarvest = harvestPerSec * numSec;

    if (userRecord.amountHarvested + userRecord.pendingHarvest > userRecord.projectedHarvest) {
      userRecord.pendingHarvest = userRecord.projectedHarvest - userRecord.amountHarvested;
    }

    state.data.userRecord = userRecord;
    commit('updateIfoData', state.data);

    if (isHarvesting && userRecord.committed > 0 && userRecord.amountHarvested < userRecord.projectedHarvest) {
      setTimeout(() => { dispatch('updatePendingHarvest') }, 1 * 1000);
    }
  },

  async stakeIfo({ commit, dispatch, state }, amount) {
    const ifoContract = await getWalletContract(state.contracts.pixel);
    const amountB = BigNumber(amount).times(10 ** 6).idiv(1).toNumber();

    ifoContract.methods
      .deposit()
      .send({ amount: amountB, mutez: true }).then(tx => {
        commit('updateIfoLoading', true);
        tx.confirmation().then(() => {
          dispatch('softUpdateIfo').then(() => {
            commit('updateIfoLoading', false);
          });
        });
      });
  },

  async harvestIfo({ commit, dispatch, state }) {
    const ifoContract = await getWalletContract(state.contracts.pixel);

    ifoContract.methods
      .harvest()
      .send().then(tx => {
        commit('updateIfoLoading', true);
        tx.confirmation(2).then(() => {
          dispatch('softUpdateIfo').then(() => {
            commit('updateIfoLoading', false);
          });
        });
      });
  },

  async walletConnected({ commit, dispatch }) {
    commit('updateIfoLoading', true);
    dispatch('softUpdateIfo').then(() => {
      commit('updateIfoLoading', false);
    });
  }

};
