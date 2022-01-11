import mutations from "./mutations";
import actions from "./actions";

export default {
  state: {
    loading: false,
    assets: [],
    netWorth: 0,
    crunchBal: 0,
    crDaoBal: 0,
  },
  actions,
  mutations,
};
