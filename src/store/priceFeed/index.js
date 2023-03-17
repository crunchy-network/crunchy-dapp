import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    loading: false,
    data: {},
    xtzUsdtPrice: 0,
    xtzUsdtPriceHistory: [],
  },
  actions,
  mutations,
  getters: {
    getPriceFeed(state) {
      return state.data;
    },
    getXtzUsdtPrice(state) {
      return state.xtzUsdtPrice;
    },
  },
};
