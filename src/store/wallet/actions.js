import { BigNumber } from "bignumber.js";
import {
  requestPermissions,
  getActiveAccount,
  clearActiveAccount,
  wallet,
  Tezos,
} from "../../utils/tezos";
import tzdomains from "./../../utils/tezos-domains";

export default {
  async connectWallet({ commit, state, dispatch }) {
    if (!state.connected) {
      return getActiveAccount().then((account) => {
        if (account) {
          commit("updateWallet", {
            connected: true,
            pkh: account.address,
            pkhDomain: tzdomains.resolveAddressToName(
              account.address,
              `${account.address.substr(0, 6)}...${account.address.substr(-6)}`
            ),
            updateBalanceInt: setInterval(
              () => dispatch("updateWalletBalance"),
              15 * 1000
            ),
          });
          dispatch("updateWalletBalance");
          dispatch("walletConnected");
        }
      });
    }
  },

  async disconnectWallet({ commit, state, dispatch }) {
    clearActiveAccount().then(() => {
      clearInterval(state.updateBalanceInt);
      commit("updateWallet", {
        connected: false,
        pkh: "",
        pkhDomain: Promise.resolve(""),
        updateBalanceInt: null,
      });
      dispatch("updateWalletBalance");
    });
  },

  async updateWalletBalance({ commit, state }) {
    if (state.connected) {
      commit("updateWalletBalance", await Tezos.tz.getBalance(state.pkh));
    } else {
      commit("updateWalletBalance", new BigNumber(0));
    }
  },

  async checkWalletConnected({ commit, dispatch }) {
    wallet.client.getActiveAccount().then((account) => {
      if (account) {
        commit("updateWallet", {
          connected: true,
          pkh: account.address,
          pkhDomain: tzdomains.resolveAddressToName(
            account.address,
            `${account.address.substr(0, 6)}...${account.address.substr(-6)}`
          ),
          updateBalanceInt: setInterval(
            () => dispatch("updateWalletBalance"),
            15 * 1000
          ),
        });
        dispatch("updateWalletBalance");
        dispatch("walletConnected");
      }
    });
  },

  async changeWallet({ dispatch }) {
    requestPermissions().then(() => {
      dispatch("checkWalletConnected");
    });
  },
};
