import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    showUsd: false,
    localStorage: "SHOW_USD_LOCAL_STORAGE_KEY",
  },
  actions,
  mutations,
  getters: {
    getShowUsd(state) {
      return state.showUsd;
    },
  },
};
