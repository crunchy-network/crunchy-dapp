<template>
  <div id="crnchy-stake-input">
    <div
      style="
        text-align: right;
        padding-right: 18px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      "
    >
      <slot></slot>
      <div style="justify-self: flex-end">
        <p
          style="
            font-weight: 500;
            font-size: 12px;
            color: var(--color-subheading-text);
            display: inline;
          "
        >
          Balance:
          <span>{{
            vueNumberFormat(maxInput, {
              prefix: "",
              decimal: ".",
              thousand: ",",
              precision: 4,
            })
          }}</span>
        </p>
        <el-button
          style="
            padding: 0;
            margin-left: 16px;
            color: #555cff;
            font-weight: 500;
            font-size: 12px;
          "
          type="text"
          @click="
            () => {
              inputAmount = maxInput;
              setInputAmount(maxInput);
            }
          "
          >Max</el-button
        >
      </div>
    </div>
    <el-card
      style="width: 100%"
      body-style="padding: 12px 16px; display: flex; gap: 4px "
    >
      <div style="display: flex; align-items: center">
        <img
          shape="circle"
          src="../../assets/token-icons/crnchy.png"
          :size="30"
          class="img-style"
        />
        <span class="selected-asset-input">CRNCHY</span>
      </div>
      <el-input
        v-model="inputAmount"
        :class="`asset-swap-amount ${inputFontSize}`"
        type="number"
        style="padding: 0"
        @input="(e) => setInputAmount(e)"
      />
    </el-card>

    <div style="text-align: right; padding-right: 18px">
      <price-format
        :value="3.25"
        prefix="~$"
        :precision="2"
        :custom-setting="true"
        :font-size="12"
        color="var(--color-subheading-text)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PriceFormat from "../PriceFormat.vue";

export default {
  name: "CrnchyStakeInput",
  components: { PriceFormat },
  props: {
    setInputAmount: {
      type: Function,
      default: () => {},
    },
    initialAmount: 0,
    mode: {
      type: String,
      default: "stake",
    },
  },
  data() {
    return {
      inputAmount: 0,
    };
  },
  mounted() {
    this.inputAmount = this.initialAmount;
  },
  computed: {
    ...mapState(["crnchyStaking"]),

    maxInput: function () {
      return this.mode === "stake"
        ? this.crnchyStaking.myStaking.crnchyBalance
        : this.crnchyStaking.myStaking.nextCycle.deposit;
    },

    inputFontSize: function () {
      if (!this.inputAmount) {
        return "";
      }

      const inputLen = this.inputAmount.toString().length;
      if (inputLen > 15) {
        return "really-mini-font";
      }
      if (inputLen > 11) {
        return "mini-font";
      }

      return "";
    },
  },
};
</script>

<style lang="scss">
#crnchy-stake-input {
  .el-input__inner {
    background: transparent;
    color: var(--primary-text) !important;
    border-color: var(--border-color);
    padding: 0 !important;

    &::placeholder {
      color: var(--color-subheading-text);
    }
  }
}
</style>
