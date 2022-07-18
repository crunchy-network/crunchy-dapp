<template>
  <div class="swap-route-item">
    <div>
      <img
        class="dex-icon"
        :src="icons[route.dexType || route.dex]"
        alt="dex icon"
        :title="route.dex"
        @click="handleDexClick(route.dexAddress)"
      />
    </div>
    <div v-if="aToken && bToken" class="token-icon-container">
      <div class="token-icon-image left">
        <img
          :src="aToken.icon"
          :alt="route.a.tokenSymbol"
          :title="aToken.asset"
          @error="hideBrokenImage"
          @load="showLoadedImage"
        />
      </div>
      <div class="token-icon-image right">
        <img
          :src="bToken.icon"
          :title="bToken.asset"
          :alt="route.b.tokenSymbol"
          @error="hideBrokenImage"
          @load="showLoadedImage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import liquidity from "../assets/dex-icons/LiquidityBaking.png";
import plenty from "../assets/dex-icons/Plenty.svg";
import quipuswap from "../assets/dex-icons/QuipuSwap.svg";
import vortex from "../assets/dex-icons/Vortex.svg";
import spicy from "../assets/dex-icons/Spicy.png";
import wtz from "../assets/dex-icons/Wtz.png";
import youves from "../assets/dex-icons/Youves.svg";
export default {
  props: {
    route: { type: Object, required: true },
    aToken: { type: Object, required: true },
    bToken: { type: Object, required: true },
  },
  data: function () {
    return {
      icons: {
        LiquidityBaking: liquidity,
        Plenty: plenty,
        PlentyStable: plenty,
        PlentyCtezTez: plenty,
        QuipuSwap: quipuswap,
        QuipuSwapTokenToTokenDex: quipuswap,
        Quipuswap: quipuswap,
        Vortex: vortex,
        Spicy: spicy,
        WTZ: wtz,
        Youves: youves,
      },
    };
  },
  methods: {
    hideBrokenImage(e) {
      e.target.style.opacity = 0;
    },
    showLoadedImage(e) {
      e.target.style.opacity = 1;
    },
    handleDexClick(dex) {
      const url = `https://better-call.dev/mainnet/${dex}/operations`;
      window.open(url, "_blank").focus();
    },
  },
};
</script>

<style lang="scss">
@media (min-width: 500px) {
  .swap-route-item {
    width: 100px;
    height: 100px;
    .dex-icon {
      height: 32px;
      width: 32px;
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .token-icon-container {
    .token-icon-image {
      height: 24px;
      width: 24px;
    }
    img {
      height: 24px;
      width: 24px;
    }
  }
  .left {
    left: 28px;
  }
  .right {
    right: 28px;
  }
}

@media (max-width: 500px) {
  .swap-route-item {
    width: 75px;
    height: 75px;
    .dex-icon {
      height: 28px;
      width: 28px;
      margin-top: 6px;
    }
  }
  .token-icon-container {
    .token-icon-image {
      height: 20px;
      width: 20px;
    }
    img {
      height: 20px;
      width: 20px;
    }
  }
  .left {
    left: 22px;
  }
  .right {
    right: 22px;
  }
}

.swap-route-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  border-radius: 18px;
  border: 1px solid rgba(25, 27, 31, 0.1);
}

.token-icon-container {
  flex: 100%;
  height: 50px;
  position: relative;
  .token-icon-image {
    top: 7px;
    position: absolute;
    border-radius: 50%;
    background-color: rgb(153, 153, 153);
  }
}
</style>
