import tzkt from "./../../utils/tzkt";
import coingecko from "./../../utils/coingecko";
import { getWalletContract } from "./../../utils/tezos";
import { BigNumber } from "bignumber.js";

export default {
  async updateWtzXtzUsdVwap({ commit }) {
    return coingecko.getXtzUsdPrice().then((price) => {
      commit("updateWtzXtzUsdVwap", price);
    });
  },

  async updateWtzStorage({ state }) {
    return tzkt.getContractStorage(state.contractSwap).then((resp) => {
      return resp.data;
    });
  },

  async loadWtzData({ state, commit, dispatch }) {
    dispatch("updateWtzXtzUsdVwap");

    if (!state.loading) {
      commit("updateWtzLoading", true);

      const storage = await dispatch("updateWtzStorage");
      commit(
        "updateWtzTotalTvlTez",
        BigNumber(storage.totalXtzSum).div(BigNumber(10).pow(6)).toNumber()
      );
      commit("updateWtzSwapRatio", BigNumber(storage.swapRatio));

      const wtzBalance = await dispatch("getWtzBalance");
      commit("updateWtzBalance", wtzBalance);

      commit("updateWtzLoading", false);
    }
  },

  async getWtzBalance({ state, rootState }) {
    return tzkt
      .getContractBigMapKeys(state.contractWtz, "ledger", {
        "key.address": rootState.wallet.pkh,
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

  async wtzWrap({ state, rootState, commit, dispatch }, amountToWrap) {
    const wtzSwap = await getWalletContract(state.contractSwap);
    const amount = BigNumber(amountToWrap)
      .times(BigNumber(10).pow(6))
      .idiv(1)
      .toNumber();

    try {
      commit("updateWtzLoading", true);

      const tx = await wtzSwap.methods
        .wrap(rootState.wallet.pkh)
        .send({ amount: amount, mutez: true });

      tx.confirmation().finally(() => {
        commit("updateWtzLoading", false);
        dispatch("loadWtzData");
      });
    } catch (e) {
      commit("updateWtzLoading", false);
      console.log(e);
    }
  },

  async wtzUnwrap({ state, rootState, commit, dispatch }, amountToUnwrap) {
    const wtzSwap = await getWalletContract(state.contractSwap);
    const amount = BigNumber(amountToUnwrap)
      .times(BigNumber(10).pow(6))
      .idiv(1)
      .toNumber();

    try {
      commit("updateWtzLoading", true);

      const tx = await wtzSwap.methods
        .unwrap(amount, rootState.wallet.pkh)
        .send();

      tx.confirmation().finally(() => {
        commit("updateWtzLoading", false);
        dispatch("loadWtzData");
      });
    } catch (e) {
      commit("updateWtzLoading", false);
      console.log(e);
    }
  },
};
