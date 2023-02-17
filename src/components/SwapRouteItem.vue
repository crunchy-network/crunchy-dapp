<template>
  <div class="swap-route-item">
    <div class="dex">
      <img
        class="dex-icon"
        :src="icons[route.dexType || route.dex]"
        alt="dex icon"
        :title="route.dex"
        @click="handleDexClick(route.dexAddress)"
      />
      {{ displayName[route.dex] }}
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
import sirius from "../assets/dex-icons/Sirius.svg";
import plenty from "../assets/dex-icons/Plenty.svg";
import quipuswap from "../assets/dex-icons/QuipuSwap.png";
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
        LiquidityBaking: sirius,
        Plenty: plenty,
        PlentyStable: plenty,
        PlentyCtezTez: plenty,
        QuipuSwap: quipuswap,
        QuipuSwapTokenToTokenDex: quipuswap,
        Quipuswap: quipuswap,
        QuipuswapStable: quipuswap,
        Vortex: vortex,
        Spicy: spicy,
        WTZ: wtz,
        Youves: youves,
      },
      displayName: {
        LiquidityBaking: "Sirius",
        Plenty: "Plenty",
        PlentyStable: "Plenty",
        PlentyCtezTez: "Plenty",
        QuipuSwap: "Quipu",
        QuipuSwapTokenToTokenDex: "Quipu",
        Quipuswap: "Quipu",
        QuipuswapStable: "Quipu",
        Vortex: "Vortex",
        Spicy: "Spicy",
        WTZ: "WTZ",
        Youves: "Youves",
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
@import "../crunchy-variables.scss";

.dex {
  font-size: 12px;
  color: var(--color-subheading-text);
  font-weight: 500;
  margin-bottom: 8px;
  .dex-icon {
    height: 16px;
    width: 16px;
    margin-top: 10px;
    display: inline-block;
    vertical-align: bottom;
  }
}

.token-icon-container {
  .token-icon-image {
    height: 16px;
    width: 16px;
  }
  img {
    display: block;
    height: 16px;
    width: 16px;
    border-radius: 50%;
  }
}
.left {
  left: 31px;
}
.right {
  right: 31px;
}

@media (min-width: 500px) {
  .swap-route-item {
    width: 90px;
    .dex-icon {
      cursor: pointer;
    }
  }
}

@media (max-width: 500px) {
  .swap-route-item {
    width: 76px;
    height: 76px;
    .dex-icon {
      margin-top: 6px;
    }
  }
  .left {
    left: 24px;
  }
  .right {
    right: 24px;
  }
}

.swap-route-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 18px;
  border: var(--line-border);
  background: var(--background-card);
  z-index: 1;
}

.token-icon-container {
  flex: 100%;
  height: 38px;
  position: relative;
  .token-icon-image {
    top: 7px;
    position: absolute;
    border-radius: 50%;
    background: transparent;
  }
}
</style>
