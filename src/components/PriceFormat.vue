<template>
  <h2
    :style="`font-weight: ${fontWeight} !important; font-size: ${handleFontSize()}px !important; line-height: ${lineHeight}; color: ${color};`"
  >
    {{
      vueNumberFormat(shortHand ? numShorthand().value : value, {
        prefix: customSetting
          ? prefix
          : !usdValue || !getShowUsd
          ? prefix.replace("$", "")
          : getShowUsd && prefix.includes("$")
          ? prefix
          : getShowUsd
          ? "$"
          : prefix,
        suffix: `${shortHand && numShorthand().suffix}${
          customSetting
            ? suffix
            : getShowUsd || !value
            ? suffix.replace("ꜩ", "")
            : !getShowUsd && suffix.includes("ꜩ")
            ? suffix
            : !getShowUsd
            ? "ꜩ"
            : suffix
        }`,
        decimal: ".",
        thousand: ",",
        precision: handlePrecision(),
      })
    }}
    <number-tooltip
      :number="getShowUsd ? usdValue.toString() : value.toString()"
      :dp="0.00000001"
    ></number-tooltip>
    <slot />
  </h2>
</template>

<script>
import { mapGetters } from "vuex";
import numberFormat from "../utils/number-format";
import NumberTooltip from "./NumberTooltip.vue";

export default {
  name: "PriceFormat",
  components: { NumberTooltip },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    usdValue: {
      type: Number,
      default: 0,
    },
    prefix: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
    fontSize: {
      type: Number,
      default: 14,
    },
    fontWeight: {
      type: Number,
      default: 600,
    },
    lineHeight: {
      type: String,
      default: "unset",
    },
    color: {
      type: String,
      default: "var(--color-text)",
    },
    shortHand: {
      type: Boolean,
      default: true,
    },
    precision: {
      type: Number,
      default: null,
    },
    customSetting: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters(["getShowUsd"]),
  },

  methods: {
    handlePrecision() {
      let precision = 2;

      if (!this.getShowUsd) {
        if (this.value < 0.0000000001 && this.value > 0) {
          precision = 12;
        } else if (this.value < 0.00000001 && this.value > 0) {
          precision = 10;
        } else if (this.value < 0.000001 && this.value > 0) {
          precision = 8;
        } else if (this.value < 0.0001 && this.value > 0) {
          precision = 6;
        } else if (this.value < 0.001 && this.value > 0) {
          precision = 4;
        } else {
          precision = 2;
        }

        return this.value >= 1
          ? 2
          : this.precision > precision
          ? this.precision
          : precision;
      } else {
        if (this.usdValue < 0.0000000001 && this.usdValue > 0) {
          precision = 12;
        } else if (this.usdValue < 0.00000001 && this.usdValue > 0) {
          precision = 10;
        } else if (this.usdValue < 0.000001 && this.usdValue > 0) {
          precision = 8;
        } else if (this.usdValue < 0.0001 && this.usdValue > 0) {
          precision = 6;
        } else if (this.usdValue < 0.001 && this.usdValue > 0) {
          precision = 4;
        } else {
          precision = 2;
        }

        return this.usdValue >= 1
          ? 2
          : this.precision > precision
          ? this.precision
          : precision;
      }
    },

    handleFontSize() {
      return this.handlePrecision() > this.precision
        ? this.fontSize - (this.handlePrecision() - 2) / 2
        : this.fontSize;
    },

    numShorthand() {
      return numberFormat.shorthand(
        this.getShowUsd && this.usdValue ? this.usdValue : this.value
      );
    },
  },
};
</script>
<style lang="scss" scoped>
h2 {
  margin: 0;
}
</style>
