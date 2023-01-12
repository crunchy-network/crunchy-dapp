export default {
  toggleUsdXtzSwitch({ state, commit }, newValue) {
    const value = newValue.toUpperCase();
    commit("updateShowUsd", value);

    localStorage.setItem(state.ls_key, value);
  },

  lsUsdState({ state, commit }) {
    if (localStorage.getItem(state.ls_key)) {
      commit("updateShowUsd", localStorage.getItem(state.ls_key));
    }
  },
};
