import homeWallet from "../../utils/home-wallet";
import homeWalletStake from "../../utils/home-wallet-stake";

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
      dispatch("loadCrunchyStake");
      commit("updateHomeWalletLoading", false);
    });
  },

  async softUpdateWalletAssets({ dispatch }) {
    dispatch("fetchHomeWalletBalances").then(() => {
      dispatch("loadBalAndNetworth");
      dispatch("loadCrunchyStake");
    });
  },

  async loadStakeAsssets({ dispatch, commit }, pkh) {
    commit("updateStakeLoading", true);

    dispatch("loadCrunchyStake").then(() => {
      commit("updateStakeLoading", false);
    });
  },

  async softUpdateStakeAssets({ dispatch }) {
    dispatch("fetchHomeWalletBalances").then(() => {
      dispatch("loadCrunchyStake");
    });
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
        const [crunchyStake, quipusStake] = await Promise.all([
          homeWalletStake.getUsersCrunchyStake(farmsData, rootState.wallet.pkh),
          homeWalletStake.getUsersQuipusStake(rootState.wallet.pkh),
        ]);

        const crunchy = { ...state.crunchyStake, ...crunchyStake };
        const quipus = { ...state.quipusStake, ...quipusStake };
        commit("updateCrunchyStake", crunchy);
        commit("updateQuipusStake", quipus);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
