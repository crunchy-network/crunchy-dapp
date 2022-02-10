import tzkt from "./../../utils/tzkt";
import { getBatch, getContract } from "./../../utils/tezos";
import { BigNumber } from "bignumber.js";

export default {
  async loadRcktData({ state, commit, dispatch }) {
    if (!state.loading) {
      commit("updateRcktLoading", true);

      const rcktBalance = await dispatch("getRcktBalance");
      commit("updateRcktBalance", rcktBalance);

      const rkdaoBalance = await dispatch("getRkdaoBalance");
      commit("updateRkdaoBalance", rkdaoBalance);

      commit("updateRcktLoading", false);
    }
  },

  async walletConnected({ state, commit, dispatch }) {
    if (!state.loading) {
      commit("updateRcktLoading", true);

      const rcktBalance = await dispatch("getRcktBalance");
      commit("updateRcktBalance", rcktBalance);

      const rkdaoBalance = await dispatch("getRkdaoBalance");
      commit("updateRkdaoBalance", rkdaoBalance);

      commit("updateRcktLoading", false);
    }
  },

  async getRcktBalance({ state, rootState }) {
    return tzkt
      .getContractBigMapKeys(state.contractRckt, "ledger", {
        key: rootState.wallet.pkh,
        active: "true",
      })
      .then((tokenLedger) => {
        let tokenBal = BigNumber(0);
        if (tokenLedger.data.length) {
          tokenBal = BigNumber(tokenLedger.data[0].value).div(
            BigNumber(10).pow(6)
          );
        }
        return tokenBal.toNumber();
      });
  },

  async getRkdaoBalance({ state, rootState }) {
    return tzkt
      .getContractBigMapKeys(state.contractRkdao, "ledger", {
        key: rootState.wallet.pkh,
        active: "true",
      })
      .then((tokenLedger) => {
        let tokenBal = BigNumber(0);
        if (tokenLedger.data.length) {
          tokenBal = BigNumber(tokenLedger.data[0].value).div(
            BigNumber(10).pow(8)
          );
        }
        return tokenBal.toNumber();
      });
  },

  async swapRckt({ state, rootState, commit, dispatch }, amountToSwap) {
    const swapContract = await getContract(state.contractRcktSwap);
    const rcktContract = await getContract(state.contractRckt);
    const amount = BigNumber(amountToSwap)
      .times(BigNumber(10).pow(6))
      .idiv(1)
      .toNumber();

    try {
      const batch = await getBatch()
        .withContractCall(
          rcktContract.methods.update_operators([
            {
              add_operator: {
                owner: rootState.wallet.pkh,
                operator: state.contractRcktSwap,
                token_id: 0,
              },
            },
          ])
        )
        .withContractCall(swapContract.methods.swap(amount))
        .withContractCall(
          rcktContract.methods.update_operators([
            {
              remove_operator: {
                owner: rootState.wallet.pkh,
                operator: state.contractRcktSwap,
                token_id: 0,
              },
            },
          ])
        );

      batch.send().then((tx) => {
        commit("updateRcktLoading", true);
        tx.confirmation().finally(() => {
          commit("updateRcktLoading", false);
          dispatch("loadRcktData");
        });
      });
    } catch (e) {
      commit("updateRcktLoading", false);
      console.log(e);
    }
  },

  async swapRkdao({ state, rootState, commit, dispatch }, amountToSwap) {
    const swapContract = await getContract(state.contractRkdaoSwap);
    const rkdaoContract = await getContract(state.contractRkdao);
    const amount = BigNumber(amountToSwap)
      .times(BigNumber(10).pow(8))
      .idiv(1)
      .toNumber();

    try {
      const batch = await getBatch()
        .withContractCall(
          rkdaoContract.methods.update_operators([
            {
              add_operator: {
                owner: rootState.wallet.pkh,
                operator: state.contractRkdaoSwap,
                token_id: 0,
              },
            },
          ])
        )
        .withContractCall(swapContract.methods.swap(amount))
        .withContractCall(
          rkdaoContract.methods.update_operators([
            {
              remove_operator: {
                owner: rootState.wallet.pkh,
                operator: state.contractRkdaoSwap,
                token_id: 0,
              },
            },
          ])
        );

      batch.send().then((tx) => {
        commit("updateRcktLoading", true);
        tx.confirmation().finally(() => {
          commit("updateRcktLoading", false);
          dispatch("loadRcktData");
        });
      });
    } catch (e) {
      commit("updateRcktLoading", false);
      console.log(e);
    }
  },
};
