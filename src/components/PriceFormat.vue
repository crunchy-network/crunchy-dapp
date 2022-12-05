<template>
  <div>
    <h2
      :style="`font-weight: ${fontWeight}; font-size: ${handleFontSize()}px; line-height: ${lineHeight}; color: ${color};`"
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
    </h2>
    <number-tooltip :number="value" :dp="0.00000001"></number-tooltip>
  </div>
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
      default: 16,
    },
    fontWeight: {
      type: Number,
      default: 600,
    },
    lineHeight: {
      type: Number,
      default: 19,
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

  methods: {
    handlePrecision() {
      let precision = 2;
      switch (this.vlue) {
        case this.value < 0.001 && this.value > 0:
          precision = 4;
          break;
        case this.value < 0.00001 && this.value > 0:
          precision = 6;
          break;
        case this.value < 0.000001 && this.value > 0:
          precision = 8;
          break;
        case this.value < 0.0000001 && this.value > 0:
          precision = 10;
          break;
        case this.value < 0.00000001 && this.value > 0:
          precision = 12;
          break;
        default:
          precision = 2;
          break;
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

<style lang="scss" scoped></style>
