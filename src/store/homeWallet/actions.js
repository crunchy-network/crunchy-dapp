import homeWallet from "../../utils/home-wallet";
import homeWalletStake from "../../utils/home-wallet-stake";
import { getWalletContract } from "../../utils/tezos";
import merge from "deepmerge";

export default {
  async fetchHomeWalletBalances({ rootState, commit }, pkh) {
    if (!pkh && !rootState.wallet.pkh) {
      // @todo
    } else {
      return homeWallet
        .fetchAssetsBal(pkh || rootState.wallet.pkh)
        .then((res) => {
          commit("updateAssets", res);
        });
    }
  },

  async loadWalletAsssets({ dispatch, commit }, pkh) {
    commit("updateHomeWalletLoading", true);
    dispatch("fetchHomeWalletBalances", pkh).then(() => {
      dispatch("loadBalAndNetworth");
      commit("updateHomeWalletLoading", false);
    });
  },

  async softUpdateWalletAssets({ dispatch }) {
    dispatch("fetchHomeWalletBalances").then(() => {
      dispatch("loadBalAndNetworth");
      dispatch("loadCrunchyStake");
    });
  },

  async loadStakeAssets({ dispatch, commit }, pkh) {
    commit("updateStakeLoading", true);

    await Promise.all([
      dispatch("loadCrunchyStake"),
      dispatch("loadQuipuLpStake"),
    ]).then(() => {
      commit("updateStakeLoading", false);
    });
  },

  async softUpdateStakeAssets({ dispatch }) {
    await Promise.all([
      dispatch("loadCrunchyStake"),
      dispatch("loadQuipuLpStake"),
    ]);
  },

  async loadBalAndNetworth({ state, commit }) {
    commit("updateCrunchBal", homeWallet.handleChrunchBal(state.assets));
    commit("updateCrDAOBal", homeWallet.handleCrDAOBal(state.assets));
    commit("updateNetworth", homeWallet.calcNetworth(state.assets));
    commit("updateNetworthUsd", homeWallet.calcUsdNetworth(state.assets));
  },

  async loadCrunchyStake({ rootState, state, dispatch, commit }) {
    try {
      await dispatch("fetchAllFarms");
      if (Object.keys(rootState.farms.data).length > 0) {
        const farmsData = rootState.farms.data;
        const crunchyStake = await homeWalletStake.getUsersCrunchyStake(
          farmsData,
          rootState.wallet.pkh
        );

        const crunchy = merge(state.crunchyStake, crunchyStake);
        commit("updateCrunchyStake", crunchy);
      }
    } catch (error) {
      console.log(error);
    }
  },

  async loadQuipuLpStake({ rootState, state, dispatch, commit }) {
    try {
      // const quipusStake = await homeWalletStake.getUsersQuipusStake(
      //   rootState.wallet.pkh
      // );
      // const quipus = merge(state.quipusStake, quipusStake);
      // commit("updateQuipusStake", quipus);
    } catch (error) {
      console.log(error);
    }
  },

  async harvestQuipuLpStake({ commit, rootState, dispatch }, contract) {
    const lpContract = await getWalletContract(contract);

    lpContract.methods
      .withdrawProfit(rootState.wallet.pkh)
      .send()
      .then((tx) => {
        tx.confirmation().then(() => {
          dispatch("loadQuipuLpStake");
        });
      });
  },
};
