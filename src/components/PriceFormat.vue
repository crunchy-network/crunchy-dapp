<template>
  <h2
    :style="`font-weight: ${fontWeight} !important; font-size: ${handleFontSize()}px !important; line-height: ${lineHeight}; color: ${color};`"
  >
    {{
      vueNumberFormat(shortHand ? numShorthand().value : value, {
        prefix: prefix,
        suffix: suffix || shortHand ? numShorthand().suffix : "",
        decimal: ".",
        thousand: ",",
        precision: handlePrecision(),
      })
    }}
    <number-tooltip :number="value" :dp="0.00000001"></number-tooltip>
    <slot />
  </h2>
</template>

<script>
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
      default: "#303133",
    },
    shortHand: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    console.log(this.value);
  },

  methods: {
    handlePrecision() {
      let precision = 2;

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

      return precision;
    },

    handleFontSize() {
      return this.fontSize - (this.handlePrecision() - 2) / 2;
    },

    numShorthand() {
      return numberFormat.shorthand(this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
}
</style>
