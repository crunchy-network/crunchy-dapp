export default {
  toggleTheme({ state, commit }) {
    commit("updateTheme", "dark");
    // const theme = state.currentTheme === "light" ? "dark" : "light";
    // commit("updateTheme", theme);
    // localStorage.setItem(state.ls_key, theme);
  },

  loadLSTheme({ state, commit }) {
    commit("updateTheme", "dark");
  },
};
