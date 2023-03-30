import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    currentTheme: "dark",
    ls_key: "THEME_LOCAL_STORAGE_KEY",
  },
  actions,
  mutations,
  getters: {
    getTheme(state) {
      return state.currentTheme;
    },
    isDarkTheme(state) {
      return state.currentTheme === "dark";
    },
  },
};
