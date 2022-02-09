import { BigNumber } from "bignumber.js";
import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    loading: false,
    contractRckt: process.env.VUE_APP_CONTRACTS_ROCKET,
    contractRkdao: process.env.VUE_APP_CONTRACTS_RKDAO,
    contractRcktSwap: process.env.VUE_APP_CONTRACTS_ROCKET_SWAP,
    contractRkdaoSwap: process.env.VUE_APP_CONTRACTS_RKDAO_SWAP,
    balanceRckt: 0,
    balanceRkdao: 0,
    swapRatioRkdao: new BigNumber(198.21589897),
    swapRatioRckt: new BigNumber(0.2479134),
  },
  actions,
  mutations,
};
