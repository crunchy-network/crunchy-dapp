import Vue from "vue";
import Vuex from "vuex";
import wallet from "./wallet";
import lpLockers from "./lpLockers";
import farms from "./farms";
import burnRecord from "./burnRecord";
import wtz from "./wtz";
import rckt from "./rckt";
import ifo from "./ifo";
import ifoPixelPriv from "./ifoPixelPriv";
import homeWallet from "./homeWallet";
import swap from "./swap";
import tokenTracker from "./tokenTracker";
import usdXtzSwitch from "./usdXtzSwitch";
import theme from "./theme";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    usdXtzSwitch: usdXtzSwitch,
    lpLockers: lpLockers,
    farms: farms,
    burnRecord: burnRecord,
    wallet: wallet,
    wtz: wtz,
    rckt: rckt,
    ifo: ifo,
    ifoPixelPriv: ifoPixelPriv,
    homeWallet: homeWallet,
    swap: swap,
    tokenTracker: tokenTracker,
    theme: theme,
  },
});
