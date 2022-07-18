<template>
  <div class="bottom-section">
    <div v-if="routingFee > 0" class="row">
      <span> Routing Fee</span> <span> {{ routingFee }}%</span>
    </div>
    <div class="row">
      <span> Rate</span> <span> {{ getSwapRate() }} </span>
    </div>
    <div class="row">
      <span> Slippage Tolerance</span>
      <span style="display: flex; justify-content: right; min-height: 26px">
        <el-button
          v-for="value in toleranceOptions"
          :key="value"
          plain
          class="slippage-button"
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
      <span> {{ getCurrentTrade.outputWithSlippage }}</span>
    </div>
    <div class="row">
      <span>Price Impact</span>
      <span :style="`color: ${impactColor}`"> {{ getPriceImpact() }}</span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { ROUTING_FEE_PERCENT } from "./swapConfig";
import { calculatePriceImpact } from "../lib/SwapRouter";
export default {
  data: () => ({
    routingFee: ROUTING_FEE_PERCENT,
    toleranceOptions: [0.5, 1],
    customSlippage: "",
    impactColor: "#757679",
  }),

  computed: {
    ...mapGetters(["getSwapForm", "getCurrentTrade"]),
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
        return `1 ${inputToken.asset} ≈ ${this.vueNumberFormat(rate, {
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
      this.impactColor = impact > 5 ? "#FF4D4B" : "#757679";
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
  margin: 0px 40px;
  .row {
    color: #757679;
    width: 100%;
    font-weight: 500;
    margin-top: 5px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.slippage-button {
  padding: 2px;
  width: 33px;
  font-size: 10px;
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
</style>
