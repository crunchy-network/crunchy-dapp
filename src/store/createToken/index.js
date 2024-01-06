import actions from "./actions";
import mutations from "./mutations";
import fa2DefiFixedSupply from "./fa2-defi-fixed-supply.json";
import fa2DefiMintable from "./fa2-defi-mintable.json";

export default {
  state: {
    loading: false,
    buyBackAndBurnAddress: process.env.VUE_APP_DEX_AGGREGATE_TEZ_DESTINATION,
    fa2DefiMintable: fa2DefiMintable,
    fa2DefiFixedSupply: fa2DefiFixedSupply,
  },
  actions,
  mutations,
};
