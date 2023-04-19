<template>
  <div>
    <div id="swap-router-wrapper">
      <NavMenu />
      <SwapFormMain :token-list="tokenList" />
      <SwapFormFoot :token-list="tokenList" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavMenu from "./NavMenu.vue";
import SwapFormMain from "./SwapFormMain.vue";
import SwapFormFoot from "./SwapFormFoot.vue";
import { buildTokenListFromWalletAndPriceFeed } from "../utils/swapRouterHelper";
export default {
  name: "Swap",
  components: { NavMenu, SwapFormMain, SwapFormFoot },
  computed: {
    ...mapState(["homeWallet", "farms"]),
    tokenList() {
      console.log(this.farms.priceFeed)
      const ownedAssets = this.homeWallet.assets || [];
      const toRet = buildTokenListFromWalletAndPriceFeed(
        ownedAssets,
        this.farms.priceFeed
      );
      return toRet;
    },
  },
};
</script>
<style lang="scss">
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#swap-router-wrapper {
  padding: 40px 45px;
  @media all and (max-width: 996px) {
    padding: 20px 25px;
  }
  max-width: 420px;
  margin: auto;
}
</style>
