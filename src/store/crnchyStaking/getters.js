export default {

  cycleStart(state) {
    return (cycle) => new Date(state.settings.cycleGenesis.getTime() + (cycle * state.settings.cycleDuration));
  },

  currentCycle(state) {
    return parseInt(Math.floor(((new Date()).getTime() - state.settings.cycleGenesis.getTime()) / state.settings.cycleDuration));
  },

};
