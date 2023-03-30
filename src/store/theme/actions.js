export default {
  toggleTheme({ state, commit }) {
    console.log("toggleTheme");
    const theme = state.currentTheme === "light" ? "dark" : "light";
    commit("updateTheme", theme);

    localStorage.setItem(state.ls_key, theme);
  },

  loadLSTheme({ state, commit }) {
    if (localStorage.getItem(state.ls_key)) {
      commit("updateTheme", localStorage.getItem(state.ls_key));
    }
  },
};
