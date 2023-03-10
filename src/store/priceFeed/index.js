import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    loading: false,
    priceFeed: {},
    xtzUsdtPrice: 0,
    xtzUsdtPriceHistory: [],
  },
  actions,
  mutations,
  getters: {
    getPriceFeed(state) {
      return state.priceFeed;
    },
    getXtzUsdtPrice(state) {
      return state.xtzUsdtPrice;
    },
  },
};
