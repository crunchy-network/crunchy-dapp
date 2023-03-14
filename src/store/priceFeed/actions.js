import tokenTracker from "../../utils/token-tracker";
import tzkt from "../../utils/tzkt";

export default {
  async fetchPriceFeedAndData({ commit }) {
    commit("setLoading", true);
    try {
      const [xtzUsd, xtzUsdtHistory] = await Promise.all([
        tzkt.getXtzUsdPrice(),
        tzkt.getXtzUsdHistory(),
      ]);

      commit("setXtzUsdtPrice", xtzUsd);
      commit("setXtzUsdtPriceHistory", xtzUsdtHistory);

      const priceFeed = await tokenTracker.getTokenFeed(xtzUsd, xtzUsdtHistory);
      commit("setPriceFeed", priceFeed);
    } catch (error) {
      console.log(error);
    } finally {
      commit("setLoading", false);
    }
  },
  async softLoadPriceFeedAndData({ commit }) {
    try {
      const [xtzUsd, xtzUsdtHistory] = await Promise.all([
        tzkt.getXtzUsdPrice(),
        tzkt.getXtzUsdHistory(),
      ]);

      commit("setXtzUsdtPrice", xtzUsd);
      commit("setXtzUsdtPriceHistory", xtzUsdtHistory);

      const priceFeed = await tokenTracker.getTokenFeed(xtzUsd, xtzUsdtHistory);
      commit("setPriceFeed", priceFeed);
    } catch (error) {
      console.log(error);
    }
  },
};
