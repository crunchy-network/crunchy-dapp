import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    currentTheme: "light",
    ls_key: "THEME_LOCAL_STORAGE_KEY",
  },
  actions,
  mutations,
  getters: {
    getTheme(state) {
      return state.currentTheme;
    },
  },
};
