import homeWallet from "../../utils/home-wallet";

export default {
  async fetchHomeWalletBalances({ rootState, commit }) {
    if (!rootState.wallet.pkh) {
      return;
    } else {
      return homeWallet.fetchAssetsBal(rootState.wallet.pkh).then((res) => {
        commit("updateAssets", res);
      });
    }
  },

  async loadWalletAsssets({ dispatch, commit }) {
    commit("updateHomeWalletLoading", true);
    dispatch("fetchHomeWalletBalances").then(() => {
      dispatch("loadBalAndNetworth");
      commit("updateHomeWalletLoading", false);
    });
  },

  async softUpdateWalletAssets({ dispatch }) {
    dispatch("fetchHomeWalletBalances").then(() => {
      dispatch("loadBalAndNetworth");
    });
  },

  async loadBalAndNetworth({ state, commit }) {
    commit("updateCrunchBal", homeWallet.handleChrunchBal(state.assets));
    commit("updateCrDAOBal", homeWallet.handleCrDAOBal(state.assets));
    commit("updateNetworth", homeWallet.calcNetworth(state.assets));
    commit("updateNetworthUsd", homeWallet.calcUsdNetworth(state.assets));
  },
};
