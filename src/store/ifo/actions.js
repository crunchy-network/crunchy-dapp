import tzkt from './../../utils/tzkt'
import { getWalletContract } from './../../utils/tezos'
import { BigNumber } from 'bignumber.js'
import { getCurrContractId, projects } from './tmp'
export default {

  async updateIfoStorage({ state }) {
    let id = getCurrContractId()
    return tzkt.getContractStorage(id ? id : state.contracts.pixel)
      .then(resp => {
        console.log(resp)
        return resp.data;
      });
  },

  async updateIfoUserRecord({ rootState, state }) {
    if (!rootState.wallet.pkh) return;
    let contractId = getCurrContractId();

    return tzkt.getContractBigMapKeys(contractId ? contractId : state.contracts.pixel, "ledger", { 'key': rootState.wallet.pkh, 'active': 'true' })
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

  async handleLegacyIDO({ commit }) {
    let data = {
      harvestTime: new Date(),
      started: false,
      ended: false,
      harvesting: false,
      harvestDuration: 0,
      userRecord: {
        committed: 0,
        committedPercent: 0,
        projectedHarvest: 0,
        projectedFee: 0,
        amountHarvested: 0,
        pendingHarvest: 0,
        lastHarvest: ""
      }
    }
    const projectJson = projects.find(p => p.contractId === getCurrContractId())
    data.raisingGoal = projectJson.raisingGoal
    data.totalRaised = projectJson.totalRaised
    data.startTime = projectJson.startTime
    data.endTime = projectJson.endTime
    data.swapRate = projectJson.swapRate
    data.offeringSupply = projectJson.offeringSupply
    data.totalSupply = projectJson.totalSupply
    data.circulatingSupply = projectJson.circulatingSupply
    data.ended = true
    commit("updateIfoData", data)
  },

  async softUpdateIfo({ commit, dispatch, state }) {
    const storage = await dispatch('updateIfoStorage');
    const userRecordStorage = await dispatch('updateIfoUserRecord');
    if (!storage.ifo) {
      dispatch('handleLegacyIDO')
      return;
    }
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
    let id = getCurrContractId();
    const ifoContract = await getWalletContract(id ? id : state.contracts.pixel);
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
    let id = getCurrContractId();
    console.log("getting wallet for ", getCurrContractId())
    const ifoContract = await getWalletContract(id ? id : state.contracts.pixel);
    console.log(`got contract for`, ifoContract)
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
