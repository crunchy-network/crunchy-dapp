import tokenTracker from "../../utils/token-tracker";
import tokensToTrack from "../../tokensTracked.json";
import teztools from "../../utils/teztools";
import _ from "lodash";
import coingecko from "../../utils/coingecko";

const YESTERDAY = new Date(Date.now() - 86400000).toISOString();
const WEEK_AGO = new Date(Date.now() - 7 * 86400000).toISOString();
const MONTH_AGO = new Date(Date.now() - 30 * 86400000).toISOString();

export default {
  async fetchTokensTracked({ commit, dispatch, state }) {
    if (state.tokenList.length < 1) {
      commit("setTokenList", []);
      dispatch("_setTokenTracked");
    }
  },

  async _setTokenTracked({ commit, state, dispatch }, id) {
    commit("updateLoading", true);
    try {
      const [
        { contracts: priceFeed },
        xtzUsd,
        {
          quotesTotal: tokenHighAndLow,
          quotes1dNogaps: tokenVolumes,
          totalTvl,
        },
        // tokenVolumesYesterday,
      ] = await Promise.all([
        teztools.getPricefeed(),
        coingecko.getXtzUsdPrice(),
        tokenTracker.getQuotes(),
        // tokenTracker.getDayBeforeVolume(),
      ]);

      const tokens = [];
      for (let i = 0; i < tokensToTrack.length; i++) {
        const value = tokensToTrack[i];
        const tokenData = value;
        const token = await tokenTracker.calculateTokenData(
          tokenData,
          priceFeed,
          xtzUsd,
          tokenHighAndLow,
          tokenVolumes,
          totalTvl
          // tokenVolumesYesterday
        );

        if (token) {
          tokens.push({
            id: `${value.tokenAddress}_${value.tokenId || 0}`,
            ...token,
          });
        }
      }
      await dispatch("sortTokensTracked", tokens);
    } catch (error) {
      console.log(error);
    } finally {
      if (id) {
        dispatch("updateChartAndOverview", id);
      }
      commit("updateLoading", false);
      dispatch("softCalcTokensData");
    }
  },

  async sortTokensTracked({ commit, state }, tokens) {
    const orderedTokens = _.orderBy(tokens, ["mktCap"], ["desc"]);
    for (let index = 0; index < orderedTokens.length; index++) {
      const token = orderedTokens[index];
      token.order = index + 1;
      token.softCalcDone = false;
      // orderedTokens[index].order = index + 1;
      commit("updateTokenTracked", token);
      commit("updateTokenList", token);
    }
  },

  async softCalcTokensData({ commit, state }) {
    const xtzUsd = await coingecko.getXtzUsdPrice();
    const tokens = state.tokenList;
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      token.volume24 = await tokenTracker.calcTokenVolume(token.id, xtzUsd);
      token.softCalcDone = true;
      commit("updateTokenListIndex", { index, token });
      commit("updateTokenTracked", token);
    }
  },

  async fetchTokenTrackedWithId({ state, commit, dispatch }, id) {
    commit("cleanTokenOverview");
    commit("updateLoadingOverview", true);
    try {
      if (state.tokenList.length < 1) {
        dispatch("_setTokenTracked", id);
      } else {
        dispatch("updateChartAndOverview", id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      commit("updateLoadingOverview", false);
    }
  },

  async updateChartAndOverview({ commit, dispatch, state }, id) {
    const xtzUsd = await coingecko.getXtzUsdPrice();
    const token = state.tokensTracked[id];
    if (token) {
      const updatedToken = await tokenTracker.calcExchangeVolume(token, xtzUsd);
      commit("updateTokenOverview", updatedToken || {});
      dispatch("fetchChartData", token.id);
    }
  },

  async fetchChartData({ commit }, tokenId) {
    commit("updateChartDataLoading", true);
    const chartData = {};
    try {
      const [
        {
          quotes1d: volumeAndPrice1Day,
          quotes1w: volumeAndPrice7Day,
          quotes1mo: volumeAndPrice30Day,
        },
        allVolumeAndPrice,
        tvl1Day,
        tvl7Day,
        tvl30Day,
        tvlAll,
      ] = await Promise.all([
        tokenTracker.getPriceAndVolumeQuotes(tokenId),
        tokenTracker.getAllQuotes1d(tokenId),
        tokenTracker.getActivity(tokenId, YESTERDAY),
        tokenTracker.getActivity(tokenId, WEEK_AGO),
        tokenTracker.getActivity(tokenId, MONTH_AGO),
        tokenTracker.getAllActivity(tokenId),
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
