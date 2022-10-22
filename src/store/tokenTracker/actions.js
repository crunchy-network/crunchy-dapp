import tokenTracker from "../../utils/token-tracker";

export default {
  async fetchTokensTracked({ commit, dispatch }) {
    try {
      commit("updateLoading", true);

      const tokens = await tokenTracker.getTokens();
      commit("updateTokenList", tokens);
    } catch (error) {
      console.log(error);
    } finally {
      commit("updateLoading", false);
      dispatch("_setTokenTracked");
    }
  },

  async _setTokenTracked({ commit, state }) {
    for (const key in state.tokenList) {
      const tokenData = { id: key, ...state.tokenList[key] };
      const token = await tokenTracker.calculateTokenData(tokenData);
      token && commit("updateTokenTracked", token);
    }
  },
};
