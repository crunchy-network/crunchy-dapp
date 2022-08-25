import axios from "axios";
import homeWallet from "../../utils/home-wallet";
import homeWalletStake from "../../utils/home-wallet-stake";
import teztools from "../../utils/teztools";

export default {
  async fetchHomeWalletBalances({ rootState, commit }, pkh) {
    if (!pkh && !rootState.wallet.pkh) {
      // @todo
    } else {
      homeWallet.fetchNFts(pkh || rootState.wallet.pkh);
      return homeWallet
        .fetchAssetsBal(pkh || rootState.wallet.pkh)
        .then((res) => {
          commit("updateAssets", res);
        });
    }
  },

  async fetchNFTs({ rootState, commit }, pkh) {
    commit("updateNftsLoading", true);
    if (!pkh && !rootState.wallet.pkh) {
      // @todo
    } else {
      homeWallet.fetchNFts(pkh || rootState.wallet.pkh).then((res) => {
        commit("updateNfts", res);
        commit("updateNftsLoading", false);
      });
    }
  },
  async fetchNftCollection({ state, commit }, address) {
    let collection = {};
    if (state.nfts.length > 1) {
      collection = await homeWallet.getNftCollectionData(state.nfts, address);
    }

    commit("updateNftCollection", collection);
  },
  async softFetchNFTs({ rootState, commit }, pkh) {
    if (!pkh && !rootState.wallet.pkh) {
      // @todo
    } else {
      homeWallet.fetchNFts(pkh || rootState.wallet.pkh).then((res) => {
        commit("updateNfts", res);
      });
    }
  },

  async loadWalletAsssets({ dispatch, commit }, pkh) {
    commit("updateHomeWalletLoading", true);
    dispatch("fetchHomeWalletBalances", pkh).then(() => {
      dispatch("loadBalAndNetworth");
      dispatch("fetchNFTs", pkh).then(() => {
        commit("updateHomeWalletLoading", false);
      });
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
    const { contracts: priceFeed } = await teztools.getPricefeed();
    commit("updatePriceFeed", priceFeed);
    await Promise.all([
      dispatch("loadCrunchyStake"),
      dispatch("loadDogamiStake"),
      dispatch("loadGIFStake"),
    ]).then(() => {
      commit("updateStakeLoading", false);
    });
  },

  async softUpdateStakeAssets({ dispatch }) {
    await Promise.all([
      dispatch("loadCrunchyStake"),
      dispatch("loadDogamiStake"),
      dispatch("loadGIFStake"),
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

        const crunchy = { ...state.crunchyStake, ...crunchyStake };
        commit("updateCrunchyStake", crunchy);
      }
    } catch (error) {
      console.log(error);
    }
  },

  async loadDogamiStake({ rootState, state, dispatch, commit }) {
    try {
      const dogamiStake = await homeWalletStake.getDogamiStake(
        rootState.wallet.pkh
      );
      const dogami = { ...state.dogamiStake, ...dogamiStake };
      commit("updateDogamiStake", dogami);
    } catch (error) {
      console.log(error);
    }
  },

  async loadGIFStake({ rootState, state, dispatch, commit }) {
    try {
      const gifStake = await homeWalletStake.getGIFStake(rootState.wallet.pkh);
      const gif = { ...state.gifStake, ...gifStake };
      commit("updateGIFStake", gif);
    } catch (error) {
      console.log(error);
    }
  },

  async loadAllLiquidity({ rootState, commit }, pkh) {
    commit("updateLpLoading", true);
    const account = pkh || rootState.wallet.pkh;
    try {
      const { data: balances } = await axios.get(
        `https://staging.api.tzkt.io/v1/tokens/balances?account=${account}&balance.gt=0&limit=10000&select=token,balance`
      );

      const [quipuswap, vortex] = await Promise.all([
        homeWallet.getQuipuLp(balances),
        homeWallet.getVortexyLp(balances),
      ]);

      commit("updateQuipuswapLp", quipuswap);
      commit("updateVortexLp", vortex);
    } catch (error) {
      console.log("Error", error);
    } finally {
      commit("updateLpLoading", false);
    }
  },
  async softLoadAllLiquidity({ rootState, commit }, pkh) {
    const account = pkh || rootState.wallet.pkh;

    try {
      const { data: balances } = await axios.get(
        `https://staging.api.tzkt.io/v1/tokens/balances?account=${account}&balance.gt=0&limit=10000&select=token,balance`
      );

      const [quipuswap, vortex] = await Promise.all([
        homeWallet.getQuipuLp(balances),
        homeWallet.getVortexyLp(balances),
      ]);

      commit("updateQuipuswapLp", quipuswap);
      commit("updateVortexLp", vortex);

      commit("updateQuipuswapLp", quipuswap);
    } catch (error) {
      console.log("Error", error);
    }
  },

  async walletConnected({ dispatch, rootState }) {
    dispatch("loadWalletAsssets", rootState.wallet.pkh);
  },
};
