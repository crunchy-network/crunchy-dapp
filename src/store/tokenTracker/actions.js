import tokenTracker from "../../utils/token-tracker";
import tokensToTrack from "../../tokensTracked.json";
import _ from "lodash";
// import coingecko from "../../utils/coingecko";
import dexIndexer from "../../utils/dex-indexer";
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
      const allTokensMetadata = await dexIndexer.getAllTokens();
      const xtzUsd = await tzkt.getXtzUsdPrice();
      // const xtzUsdHistory = await coingecko.getXtzUsdHistory();
      const xtzUsdHistory = await tzkt.getXtzUsdHistory();
      // const formattedXtzUsdHistory = [];
      // for (let i = 0; i < xtzUsdHistory.length; i++) {
      //   const bucket = new Date(xtzUsdHistory[i][0]).getTime();
      //   const xtzUsdPrice = xtzUsdHistory[i][1].usd;
      //   formattedXtzUsdHistory.push([bucket,xtzUsdPrice]);
      // }

      commit("updateXtzUsdPrice", xtzUsd);
      commit("updateXtzUsdHistory", xtzUsdHistory);

      const tokenFeed = await tokenTracker.getTokenFeed(xtzUsd);

      const tokens = [];
      for (let i = 0; i < tokensToTrack.length; i++) {
        const value = tokensToTrack[i];
        value.id = `${value.tokenAddress}_${value.tokenId || 0}`;

        const tokenData = value;
        const token = await tokenTracker.calculateTokenData(
          tokenData,
          tokenFeed,
          allTokensMetadata,
          xtzUsd
          // tokenVolumesYesterday
        );

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
    const orderedTokens = _.orderBy(tokens, ["mktCap"], ["desc"]);
    const tokenList = [];
    for (let index = 0; index < orderedTokens.length; index++) {
      const token = orderedTokens[index];
      token.order = index + 1;
      token.softCalcDone = true;
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
    const xtzUsdHistory = await tzkt.getXtzUsdHistory();
    commit("updateChartDataLoading", true);
    const chartData = {};
    const exchangeId = state.tokensTracked[token.id].exchanges[0].address || "";
    try {
      const [
        {
          quotes1d: volumeAndPrice1Day,
          quotes1w: volumeAndPrice7Day,
          quotes1mo: volumeAndPrice30Day,
        },
        allVolumeAndPrice,
        { tvl1Day, tvl7Day, tvl30Day, tvlAll },
      ] = await Promise.all([
        tokenTracker.getPriceAndVolumeQuotes(
          token.id,
          token.symbol,
          xtzUsdHistory
        ),
        tokenTracker.getAllQuotes1d(token.id, token.symbol, xtzUsdHistory),
        tokenTracker.getChartTvl(
          token.id,
          exchangeId,
          token.symbol,
          xtzUsdHistory
        ),
      ]);

      chartData.allVolumeAndPrice = allVolumeAndPrice;
      chartData.volumeAndPrice1Day = volumeAndPrice1Day;
      chartData.volumeAndPrice7Day = volumeAndPrice7Day;
      chartData.volumeAndPrice30Day = volumeAndPrice30Day;
      chartData.tvl1Day = tvl1Day;
      chartData.tvl7Day = tvl7Day;
      chartData.tvl30Day = tvl30Day;
      chartData.tvlAll = tvlAll;

      commit("updateChartData", chartData);
    } catch (error) {
      console.log(error);
    } finally {
      commit("updateChartDataLoading", false);
    }
  },
};
