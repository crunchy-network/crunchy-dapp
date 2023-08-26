import actions from "./actions";
import mutations from "./mutations";
import fa2 from "./fa2.json";
import fa12 from "./fa12.json";

export default {
  state: {
    loading: false,
    buyBackAndBurnAddress: process.env.VUE_APP_DEX_AGGREGATE_TEZ_DESTINATION,
    fa12: fa12,
    fa2: fa2,
  },
  actions,
  mutations,
};
