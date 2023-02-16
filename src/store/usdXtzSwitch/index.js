import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    showUsd: "XTZ",
    ls_key: "SHOW_USD_LOCAL_STORAGE_KEY",
  },
  actions,
  mutations,
  getters: {
    getShowUsd(state) {
      return state.showUsd === "USD";
    },
  },
};
