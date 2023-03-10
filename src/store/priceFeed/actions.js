import tokenTracker from "../../utils/token-tracker";
import tzkt from "../../utils/tzkt";

export default {
  async fetchPriceFeedAndData({ commit }) {
    commit("setLoading", true);
    try {
      console.log("fetching price feed");
      const xtzUsd = await tzkt.getXtzUsdPrice();
      const xtzUsdtHistory = await tzkt.getXtzUsdHistory();

      commit("setXtzUsdtPrice", xtzUsd);
      commit("setXtzUsdtPriceHistory", xtzUsdtHistory);

      const priceFeed = await tokenTracker.getTokenFeed(xtzUsd, xtzUsdtHistory);
      console.log("====", priceFeed);
      commit("setPriceFeed", priceFeed);
    } catch (error) {
      console.log(error);
    } finally {
      commit("setLoading", false);
    }
  },
};
