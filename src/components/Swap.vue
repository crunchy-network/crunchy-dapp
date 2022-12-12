<template>
  <div>
    <div id="swap-router-wrapper">
      <NavMenu />
      <div class="disclaimer-section">
        <div class="beta-tag"><div class="beta-ribbon">BETA</div></div>
        <el-tooltip
          placement="bottom"
          effect="light"
          popper-class="disclaimer-tip"
        >
          <div slot="content">
            Crunchy.network utilizes a list of public and private API endpoints
            to pull price data. With this price data, users are allowed to
            interact with decentralized exchanges (DEXs) within the Tezos
            ecosystem. Crunchy.network does not own or operate these DEXs.
            <br />
            <br />
            Crunchy.network is not responsible for DEX issues, displayed tokens,
            price, API issues, exchange rates, and user trading decisions.
            <br />
            <br />
            The use of this product is the sole responsibility of the user.
          </div>

          <span>Disclaimer <i class="el-icon-warning" /></span>
        </el-tooltip>
      </div>

      <SwapFormMain :tokenList="tokenList" />
      <SwapFormFoot :tokenList="tokenList" />
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

  .disclaimer-section {
    width: 100%;
    text-align: center;
    margin-bottom: 8px;
  }
}
.beta-tag {
  position: fixed;
  z-index: -1;
  border-bottom: 50px solid #f15d59;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  height: 0;
  left: -52px;
  top: 108px;
  transform: rotate(-45deg);
  width: 125px;
  .beta-ribbon {
    margin-top: 5px;
    font-weight: bold;
    font-size: 24px;
    color: #ffffff;
  }
}
.disclaimer-tip {
  width: 300px;
  padding: 20px 16px;
}
</style>
