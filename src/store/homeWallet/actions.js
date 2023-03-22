import axios from "axios";
import homeWallet from "../../utils/home-wallet";
import homeWalletStake from "../../utils/home-wallet-stake";
import queryDipdup from "../../utils/queryDipdup";
import tzkt from "../../utils/tzkt";
// import teztools from "../../utils/teztools";

export default {
  async fetchHomeWalletBalances({ rootState, commit, dispatch }, pkh) {
    if (!pkh && !rootState.wallet.pkh) {
      // @todo
    } else {
      if (Object.keys(rootState.priceFeed.data).length < 1) {
        await dispatch("softLoadPriceFeedAndData");
      }
      const tokenFeed = rootState.priceFeed.data;

      homeWallet.fetchNFts(pkh || rootState.wallet.pkh);
      return homeWallet
        .fetchAssetsBal(pkh || rootState.wallet.pkh, tokenFeed)
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
      dispatch("loadBalAndPortfolio");
      dispatch("fetchNFTs", pkh).then(() => {
        commit("updateHomeWalletLoading", false);
      });
    });
  },

  async softUpdateWalletAssets({ dispatch }) {
    dispatch("fetchHomeWalletBalances").then(() => {
      dispatch("loadBalAndPortfolio");
      dispatch("loadCrunchyStake");
    });
  },

  async loadStakeAssets({ dispatch, commit }, pkh) {
    commit("updateStakeLoading", true);
    // const { contract: priceFeed } = await teztools.getPricefeed();
    // commit("updateFeed", priceFeed);
    try {
      dispatch("loadCrunchyStake", pkh);
      dispatch("loadDogamiStake", pkh);
      dispatch("loadGIFStake", pkh);
    } catch (error) {
      console.log(error);
    } finally {
      commit("updateStakeLoading", false);
    }
  },

  async softUpdateStakeAssets({ dispatch }, pkh) {
    dispatch("loadCrunchyStake", pkh);
    dispatch("loadDogamiStake", pkh);
    dispatch("loadGIFStake", pkh);
  },

  async loadBalAndPortfolio({ state, commit }) {
    commit("updateCrunchBal", homeWallet.handleChrunchBal(state.assets));
    commit("updateCrDAOBal", homeWallet.handleCrDAOBal(state.assets));
    commit("updatePortfolio", homeWallet.calcNetworth(state.assets));
    commit("updatePortfolioUsd", homeWallet.calcUsdNetworth(state.assets));
  },

  async loadCrunchyStake({ rootState, state, dispatch, commit }, pkh) {
    try {
      if (Object.keys(rootState.farms.data).length < 1) {
        await dispatch("fetchAllFarms");
      }
      if (Object.keys(rootState.farms.data).length > 0) {
        const farmsData = rootState.farms.data;

        const crunchyStake = await homeWalletStake.getUsersCrunchyStake(
          farmsData,
          pkh || rootState.wallet.pkh
        );

        const crunchy = { ...state.crunchyStake, ...crunchyStake };
        commit("updateCrunchyStake", crunchy);
      }
    } catch (error) {
      console.log(error);
    }
  },

  async loadDogamiStake({ rootState, state, dispatch, commit }, pkh) {
    try {
      if (Object.keys(rootState.priceFeed.data).length < 1) {
        await dispatch("softLoadPriceFeedAndData");
      }
      const tokenFeed = rootState.priceFeed.data;

      const dogamiStake = await homeWalletStake.getDogamiStake(
        pkh || rootState.wallet.pkh,
        tokenFeed
      );
      const dogami = { ...state.dogamiStake, ...dogamiStake };
      commit("updateDogamiStake", dogami);
    } catch (error) {
      console.log(error);
    }
  },

  async loadGIFStake({ rootState, state, dispatch, commit }, pkh) {
    try {
      if (Object.keys(rootState.priceFeed.data).length < 1) {
        await dispatch("softLoadPriceFeedAndData");
      }
      const tokenFeed = rootState.priceFeed.data;

      const gifStake = await homeWalletStake.getGIFStake(
        pkh || rootState.wallet.pkh,
        tokenFeed
      );
      const gif = { ...state.gifStake, ...gifStake };
      commit("updateGIFStake", gif);
    } catch (error) {
      console.log(error);
    }
  },

  async loadAllLiquidity({ rootState, commit, dispatch }, pkh) {
    commit("updateLpLoading", true);
    const account = pkh || rootState.wallet.pkh;
    try {
      const { data: balances } = await axios.get(
        `https://staging.api.tzkt.io/v1/tokens/balances?account=${account}&balance.gt=0&limit=10000&select=token,balance`
      );

      const [
        { data: quipuFa1Factory },
        { data: quipuFa1FactoryOld },
        { data: quipuFa2Factory },
        { data: quipuFa2FactoryOld },
        { data: quipuFa2FactoryOld3 },
      ] = await Promise.all([
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1GDtv3sqhWeSsXLWgcGsmoH5nRRGJd8xVc/contracts?limit=10000"
        ),
        axios.get(
          "https://api.tzkt.io/v1/accounts/KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS/contracts?limit=10000"
        ),
      ]);

      if (Object.keys(rootState.priceFeed.data).length < 1) {
        await dispatch("softLoadPriceFeedAndData");
      }

      const xtzUsd = rootState.priceFeed.xtzUsdtPrice;
      const priceFeed = rootState.priceFeed.data;

      const quipuswap = await homeWallet.getQuipuLp(
        balances,
        xtzUsd,
        priceFeed,
        {
          fa1Factory: quipuFa1Factory,
          fa1FactoryOld: quipuFa1FactoryOld,
          fa2Factory: quipuFa2Factory,
          fa2FactoryOld: quipuFa2FactoryOld,
          fa2FactoryOld3: quipuFa2FactoryOld3,
        }
      );
      const vortex = await homeWallet.getVortexyLp(
        balances,
        xtzUsd,
        account,
        priceFeed
      );
      const plenty = await homeWallet.getPlentyLp(balances, xtzUsd, priceFeed);
      const spicyswap = await homeWallet.getSpicySwapLp(
        balances,
        xtzUsd,
        priceFeed
      );
      const sirius = await homeWallet.getBakersLp(balances, xtzUsd, priceFeed);

      commit("updateQuipuswapLp", quipuswap);
      commit("updateVortexLp", vortex);
      commit("updateSpicyLp", spicyswap);
      commit("updatePlentyLp", plenty);
      commit("updateSiriusLp", sirius);
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

      const priceFeed = await queryDipdup.getAllTokenAndQuotes();
      const xtzUsd = await tzkt.getXtzUsdPrice();

      const [quipuswap, vortex, plenty, spicyswap, sirius] = await Promise.all([
        homeWallet.getQuipuLp(balances, xtzUsd, priceFeed),
        homeWallet.getVortexyLp(balances, xtzUsd, account, priceFeed),
        homeWallet.getPlentyLp(balances, xtzUsd, priceFeed),
        homeWallet.getSpicySwapLp(balances, xtzUsd, priceFeed),
        homeWallet.getBakersLp(balances, xtzUsd, priceFeed),
      ]);

      commit("updateQuipuswapLp", quipuswap);
      commit("updateVortexLp", vortex);
      commit("updateSpicyLp", spicyswap);
      commit("updatePlentyLp", plenty);
      commit("updateSiriusLp", sirius);
    } catch (error) {
      console.log("Error", error);
    }
  },

  async walletConnected({ dispatch, rootState }) {
    dispatch("loadWalletAsssets", rootState.wallet.pkh);
  },
};
