<template>
  <div class="bottom-section">
    <div class="row">
      <span>Routing Fee</span>
      <span style="color: var(--primary-text)">{{ routingFee }}%</span>
    </div>
    <div class="row">
      <span>Rate</span>
      <span style="color: var(--primary-text)">{{ getSwapRate() }}</span>
    </div>
    <div class="row">
      <span>Slippage Tolerance</span>
      <span
        class="slippage-button-wrapper"
        style="display: flex; justify-content: right; min-height: 26px"
      >
        <el-button
          v-for="value in toleranceOptions"
          :key="value"
          plain
          :class="[
            'slippage-button',
            { active: getSwapForm.slippageTolerance === value },
          ]"
          :type="getSwapForm.slippageTolerance === value ? 'primary' : 'info'"
          @click="
            () => {
              updateSlippage(value);
            }
          "
        >
          {{ value }}%
        </el-button>
        <el-input
          v-model="customSlippage"
          :class="`custom-slippage-tolerance ${
            getSwapForm.slippageTolerance === customSlippage ? 'active' : ''
          }`"
          @click="
            () => {
              updateSlippage(customSlippage);
            }
          "
        />
        <span style="display: flex; align-items: center">% </span>
      </span>
    </div>
    <div class="row">
      <span> Minimum Received</span>
      <span style="color: var(--primary-text)"> {{ getCurrentTrade.outputWithSlippage }}</span>
    </div>
    <div class="row">
      <span>Price Impact</span>
      <span :style="`color: ${impactColor}`"> {{ getPriceImpact() }}</span>
    </div>
    <div class="row last">
      <span>Swap Route</span>
      <div style="color: var(--link-btn-color)">
        <span v-if="numRoutes === 1 && numHops === 1">1 route / 1 hop</span>
        <span v-else-if="numRoutes === 1 && numHops > 1"
          >1 route / {{ numHops }} hops</span
        >
        <span v-else-if="numRoutes > 1"
          >{{ numRoutes }} routes / {{ numHops }} hops</span
        >
        <span v-else>~</span>
      </div>
    </div>

    <div v-if="getCurrentTrade.trades">
      <template v-if="getCurrentTrade.type === 'weighted'">
        <div
          v-for="(trade, n) in getCurrentTradesSorted"
          :key="`trade_${n}`"
          class="swap-route-container"
        >
          <div class="swap-route-label">
            {{ vueNumberFormat(trade[0].weight * 100, { precision: 2 }) }}%
          </div>
          <div class="swap-route-row">
            <div
              v-for="(route, index) in trade"
              :key="`trade_${n}_${route.dexAddress}_${index}`"
              style="display: flex; align-items: center"
            >
              <SwapRouteItem
                :route="route"
                :a-token="
                  tokenList.find((t) => route.a?.assetSlug === t?.assetSlug)
                "
                :b-token="
                  tokenList.find((t) => route.b?.assetSlug === t?.assetSlug)
                "
              />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="swap-route-container">
          <div class="swap-route-label">100%</div>
          <div class="swap-route-row">
            <div
              v-for="(route, index) in getCurrentTrade.trades"
              :key="`${route.dexAddress}_${index}`"
              style="display: flex"
            >
              <SwapRouteItem
                :route="route"
                :a-token="
                  tokenList.find((t) => route.a?.assetSlug === t?.assetSlug)
                "
                :b-token="
                  tokenList.find((t) => route.b?.assetSlug === t?.assetSlug)
                "
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { mapActions, mapGetters } from "vuex";
import SwapRouteItem from "./SwapRouteItem.vue";
import { ROUTING_FEE_PERCENT } from "./swapConfig";
import { calculatePriceImpact } from "../lib/SwapRouter";
export default {
  name: "SwapFormFoot",
  components: { SwapRouteItem },
  props: {
    tokenList: { type: Array, required: true },
  },
  data: () => ({
    toleranceOptions: [0.5, 1],
    customSlippage: "",
    impactColor: "var(color-subheading-text)",
  }),

  computed: {
    ...mapGetters(["getSwapForm", "getCurrentTrade"]),
    getCurrentTradesSorted() {
      return _.orderBy(this.getCurrentTrade.trades, ["[0].weight"], ["desc"]);
    },
    routingFee() {
      if (
        this.getCurrentTrade.trades &&
        this.getCurrentTrade.trades.length > 1
      ) {
        return ROUTING_FEE_PERCENT;
      }
      return 0.0;
    },
    numRoutes() {
      if (!this.getCurrentTrade.trades) {
        return 0;
      }
      return this.getCurrentTrade.trades.length;
    },
    numHops() {
      if (!this.getCurrentTrade.trades || !this.getCurrentTrade.trades.length) {
        return 0;
      }
      if (this.getCurrentTrade.trades.length === 1) {
        return 1;
      }
      return this.getCurrentTrade.trades.reduce((a, t) => a + t.length, 0);
    },
  },
  watch: {
    customSlippage() {
      this.updateSlippage(this.customSlippage);
    },
  },
  methods: {
    ...mapActions(["updateForm"]),
    getSwapRate() {
      try {
        const { inputAmount, inputToken, outputToken } = this.getSwapForm;
        const rate = this.getCurrentTrade.outputAmount / inputAmount;
        return `1 ${inputToken?.asset} ≈ ${this.vueNumberFormat(rate, {
          precision: 6,
        })} ${outputToken.asset}`;
      } catch (err) {
        console.log(err);
        return "";
      }
    },
    updateSlippage(value) {
      value = value === "" ? 0 : value;

      if (!isNaN(value)) {
        this.updateForm({ slippageTolerance: value });
      }
    },
    getPriceImpact() {
      const impact = calculatePriceImpact(this.getCurrentTrade);
      this.impactColor = impact > 5 ? "#FF4D4B" : "var(--color-menu-inactiv)";
      if (!impact) return "";
      return `${impact}%`;
    },
  },
};
</script>
<style lang="scss">
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.bottom-section {
  margin: 0px 16px;
  margin-top: 16px;
  .row {
    color: var(--color-subheading-text);
    width: 100%;
    font-weight: 500;
    padding: 6px 0;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--line-border);
    &.last {
      border-bottom: none;
    }
  }
}

.slippage-button {
  padding: 2px;
  width: 33px;
  font-size: 10px;
  border: var(--line-border) !important;
  background: var(--background-color) !important;
  color: var(--color-subheading-text) !important;

  &.active {
    border-color: var(--link-btn-color) !important;
    color: var(--link-btn-color) !important;
  }
}

.custom-slippage-tolerance {
  width: 33px;
  .el-input__inner {
    height: 25px !important ;
    width: 100% !important;
    background: transparent;
    padding: 2px;
    height: 26px;
  }
  margin-left: 10px;
}

.swap-route-container {
  position: relative;
  margin-top: 8px;
  display: flex;
  flex-basis: 100%;
  align-items: center;
}

.swap-route-label {
  font-size: 11px;
  width: 50px;
  color: var(--color-subheading-text);
  /* border: var(--line-border); */
  border-radius: 16px;
  padding: 4px;
  text-align: center;
  background: var(--background-color);
  z-index: 1;
}

.swap-route-row {
  display: flex;
  width: 100%;
  justify-content: space-around;
  &:before {
    content: "";
    position: absolute;
    left: 5px;
    right: 5px;
    bottom: 50%;
    border-bottom: var(--line-border);
    z-index: 0;
  }
}
</style>
