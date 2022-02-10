import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    loading: false,
    contract: process.env.VUE_APP_CONTRACTS_BURNER,
    records: [],
  },
  actions,
  mutations,
};
