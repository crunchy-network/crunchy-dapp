import tokenTracker from "../../utils/token-tracker";
import tokensToTrack from "../../tokensTracked.json";
import teztools from "../../utils/teztools";
import _ from "lodash";

export default {
  async fetchTokensTracked({ commit, dispatch, state }) {
    if (state.tokenList.length < 1) {
      commit("setTokenList", []);
      dispatch("_setTokenTracked");
    }
  },

  async _setTokenTracked({ commit, state, dispatch }) {
    const { contracts: priceFeed } = await teztools.getPricefeed();
    // commit("updateLoading", true);
    for (let i = 0; i < tokensToTrack.length; i++) {
      const value = tokensToTrack[i];
      const tokenData = value;
      const token = await tokenTracker.calculateTokenData(tokenData, priceFeed);

      if (token) {
        commit("updateTokenList", {
          id: `${value.tokenAddress}${
            value.tokenId ? "_" + value.tokenId : ""
          }`,
          ...token,
        });
      }
    }
    dispatch("sortTokensTracked");
  },

  async sortTokensTracked({ commit, state }) {
    const orderedTokens = _.orderBy(state.tokenList, ["mktCap"], ["desc"]);
    for (let index = 0; index < orderedTokens.length; index++) {
      const token = orderedTokens[index];
      token.order = index + 1;
      // orderedTokens[index].order = index + 1;
      commit("updateTokenList", token);
    }
    commit("setTokenList", orderedTokens);
  },

  async fetchTokenTrackedWithId({ state, commit, dispatch }, id) {
    if (state.tokenList.length < 1) {
      await dispatch("fetchTokensTracked");
    }

    commit("updateTokenOverview", state.tokensTracked[id] || {});
  },
};
