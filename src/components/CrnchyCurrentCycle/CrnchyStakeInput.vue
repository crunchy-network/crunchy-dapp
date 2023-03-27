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
          Balamce: <span>21</span>
        </p>
        <el-button
          style="padding: 0; color: #555cff; font-weight: 500; font-size: 12px"
          type="text"
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
          :src="'https://bafkreifcxtpqojfllakxbhkmy5qfcur7izyyr2e7c6ukm7y43v3scgsszi.ipfs.nftstorage.link/'"
          :size="30"
          class="img-style"
          @error="hideBrokenImage"
          @load="showLoadedImage"
        />
        <span class="selected-asset-input">CRNCHY</span>
      </div>
      <el-input
        v-model="inputAmount"
        :class="`asset-swap-amount ${getInputFontSize}`"
        type="number"
        :min="1"
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
import PriceFormat from "../PriceFormat.vue";

export default {
  name: "CrnchyStakeInput",
  components: { PriceFormat },
  props: {
    setInputAmount: {
      type: Function,
      default: () => {},
    },
    inputAmount: {
      type: Number,
      default: 1,
    },
  },

  methods: {
    hideBrokenImage(e) {
      e.target.style.opacity = 0;
    },
    showLoadedImage(e) {
      e.target.style.opacity = 1;
    },
    getInputFontSize() {
      if (!this.$props.amount) return "";
      const amountString = this.$props.amount.toString();
      if (amountString.length > 15) {
        return "really-mini-font";
      }
      if (amountString.length > 11) {
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
