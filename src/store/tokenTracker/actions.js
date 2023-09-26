import tokenTracker from "../../utils/token-tracker";
import tokensBlocked from "../../tokensBlocked.json";
import _ from "lodash";
import tzkt from "../../utils/tzkt";

export default {
  async fetchTokensTracked({ commit, dispatch, state }) {
    if (state.tokenList.length < 1) {
      dispatch("_setTokenTracked");
    }
  },

  async softLoadTokensTracked({ commit, dispatch, state }) {
    if (state.tokenList.length < 1) {
      dispatch("_setTokenTracked", { softLoad: true });
    }
  },

  async _setTokenTracked({ commit, state, dispatch }, payload) {
    !payload?.softLoad && commit("updateLoading", true);
    try {
      const [
        xtzUsd,
        xtzUsdHistory,
        tokenFeed
      ] = await Promise.all([
        tzkt.getXtzUsdPrice(),
        tzkt.getXtzUsdHistory(),
        tokenTracker.getTokenFeed()
      ]);

      commit("updateXtzUsdPrice", xtzUsd);
      commit("updateXtzUsdHistory", xtzUsdHistory);

      const tokens = [];
      for (const [k, element] of Object.entries(tokenFeed)) {
        const token = await tokenTracker.calculateTokenData(
          element,
          tokenFeed,
          xtzUsd
        );

        if (tokensBlocked.includes(k)) {
          continue;
        }

        if (token) {
          tokens.push({
            ...token,
          });
        }
      }
      await dispatch("sortTokensTracked", tokens);
    } catch (error) {
      console.log(error);
    } finally {
      if (payload?.id) {
        dispatch("updateChartAndOverview", payload?.id);
      }
      commit("updateLoading", false);
      dispatch("softCalcTokensData");
    }
  },

  async sortTokensTracked({ commit, state }, tokens) {
    for (const [i, token] of Object.entries(tokens)) {
      tokens[i].isRanked = token.tokenTvl >= 5000 ? 1 : 0;
    }
    const orderedTokens = _.orderBy(tokens, ["isRanked", "mktCap"], ["desc", "desc"]);
    const tokenList = [];
    const lsData = JSON.parse(localStorage.getItem(state.LS_FAVORITES_KEY));
    for (let index = 0; index < orderedTokens.length; index++) {
      const token = orderedTokens[index];
      token.order = index + 1;
      token.softCalcDone = true;
      token.isFavorite = lsData?.includes(token.id) ? 1 : 0;

      // orderedTokens[index].order = index + 1;
      commit("updateTokenTracked", token);
      tokenList.push(token);
    }
    commit("setTokenList", []);
    commit("setTokenList", tokenList);
  },

  async softCalcTokensData({ commit, state }) {
    // const tokens = state.tokenList;
    // for (let index = 0; index < tokens.length; index++) {
    //   const token = tokens[index];
    //   token.volume24 = await tokenTracker.calcTokenVolume(
    //     token.id,
    //     state.xtzUsd
    //   );
    //   token.softCalcDone = true;
    //   commit("updateTokenListIndex", { index, token });
    //   commit("updateTokenTracked", token);
    // }
  },

  async fetchTokenTrackedWithId({ state, commit, dispatch }, payload) {
    commit("cleanTokenOverview");
    !payload?.softLoad && commit("updateLoadingOverview", true);
    try {
      if (state.tokenList.length < 1) {
        dispatch("_setTokenTracked", {
          id: payload?.id,
          softLoad: payload?.softLoad,
        });
      } else {
        dispatch("updateChartAndOverview", payload?.id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      commit("updateLoadingOverview", false);
    }
  },

  async updateChartAndOverview({ commit, dispatch, state }, id) {
    const token = state.tokensTracked[id];
    if (token) {
      const updatedToken = await tokenTracker.calcHolders(token);
      commit("updateTokenOverview", updatedToken);
      dispatch("fetchChartData", token);
    }
  },

  async fetchChartData({ commit, state }, token) {
    // const xtzUsdHistory = await tzkt.getXtzUsdHistory();
    commit("updateChartDataLoading", true);
    const chartData = {};
    // const exchangeId = state.tokensTracked[token.id].exchanges[0].address || "";
    // token.spicyId = token.id.replace(":", "_");
    // if (token.standard === "fa12") {
    //   token.spicyId = token.spicyId.replace("0", "null");
    // }
    try {
      const [
        {
          quotes1h: volumeAndPrice1Hour,
          quotes4h: volumeAndPrice4Hour,
          quotes1d: volumeAndPrice1Day,
          quotes1w: volumeAndPrice7Day,
          quotes1mo: volumeAndPrice30Day,
        },
        allVolumeAndPrice,
        // { tvl1Day, tvl7Day, tvl30Day, tvlAll },
      ] = await Promise.all([
        tokenTracker.getPriceAndVolumeQuotes(token.tokenAddress, token.tokenId),
        tokenTracker.getAllQuotes1d(token.tokenAddress, token.tokenId),
        // tokenTracker.getChartTvl(
        //   token.spicyId,
        //   token.id,
        //   exchangeId,
        //   token.symbol,
        //   xtzUsdHistory
        // ),
      ]);
      
      chartData.allVolumeAndPrice = allVolumeAndPrice;
      chartData.volumeAndPrice1Hour = volumeAndPrice1Hour;
      chartData.volumeAndPrice4Hour = volumeAndPrice4Hour;
      chartData.volumeAndPrice1Day = volumeAndPrice1Day;
      chartData.volumeAndPrice7Day = volumeAndPrice7Day;
      chartData.volumeAndPrice30Day = volumeAndPrice30Day;
      chartData.tvl1Day = [];
      chartData.tvl7Day = [];
      chartData.tvl30Day = [];
      chartData.tvlAll = [];

      commit("updateChartData", chartData);
    } catch (error) {
      console.log(error);
    } finally {
      commit("updateChartDataLoading", false);
    }
  },

  setTokenAsFavourite({ commit, state }, payload) {
    if (!localStorage.getItem(state.LS_FAVORITES_KEY)) {
      localStorage.setItem(state.LS_FAVORITES_KEY, JSON.stringify([]));
    }
    const tokenId = payload;
    const lsData = JSON.parse(localStorage.getItem(state.LS_FAVORITES_KEY));
    if (!lsData.includes(tokenId)) {
      lsData.push(tokenId);

      localStorage.setItem(state.LS_FAVORITES_KEY, JSON.stringify(lsData));

      const token = state.tokensTracked[tokenId];
      token.isFavorite = 1;
      const tokens = state.tokenList;
      const index = tokens.findIndex((t) => t.id === tokenId);

      console.log(
        "🚀 ~ file: actions.js ~ line 202 ~ setTokenAsFavourite ~ index",
        index,
        token,
        tokens,
        tokenId
      );

      commit("updateTokenListIndex", { index, token });
      commit("updateTokenTracked", token);
    }
  },

  removeTokenAsFavourite({ commit, state }, payload) {
    const tokenId = payload;
    const lsData =
      JSON.parse(localStorage.getItem(state.LS_FAVORITES_KEY)) || [];
    const tokenIndex = lsData.findIndex((t) => t === tokenId);
    lsData.splice(tokenIndex, 1);
    localStorage.setItem(state.LS_FAVORITES_KEY, JSON.stringify(lsData));

    const token = state.tokensTracked[tokenId];
    token.isFavorite = 0;
    const tokens = state.tokenList;
    const index = tokens.findIndex((t) => t.id === tokenId);

    commit("updateTokenListIndex", { index, token });
    commit("updateTokenTracked", token);
  },
};
