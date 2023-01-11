export default {
  toggleUsdXtzSwitch({ state, commit }, newValue) {
    commit("updateShowUsd", newValue);

    if (newValue === true) {
      localStorage.setItem(state.localStorage, "Yes");
    } else {
      localStorage.removeItem(state.localStorage);
    }
  },

  lsUsdState({ state, commit }) {
    if (localStorage.getItem(state.localStorage) === "Yes") {
      commit("updateShowUsd", true);
    } else {
      commit("updateShowUsd", false);
    }
  },
};
