<template>
  <h2
    :style="`font-weight: ${fontWeight} !important; font-size: ${handleFontSize()}px !important; line-height: ${lineHeight}; color: ${color};`"
    :class="className"
  >
    {{
      vueNumberFormat(renderValue(), {
        prefix: prefix,
        suffix: `${shortHand ? numShorthand().suffix : ""}${suffix || ""}`,
        decimal: ".",
        thousand: ",",
        precision: handlePrecision(),
      })
    }}
    <number-tooltip
      :number="value.toString()"
      :dp="0.00000001"
    ></number-tooltip>

    <slot />
  </h2>
</template>
<script>
import numberFormat from "../utils/number-format";
import NumberTooltip from "./NumberTooltip.vue";

export default {
  name: "NumberFormat",
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
      default: "var(--primary-text)",
    },
    shortHand: {
      type: Boolean,
      default: true,
    },
    precision: {
      type: Number,
      default: null,
    },
    className: {
      type: String,
      default: "",
    },
  },

  methods: {
    handlePrecision() {
      let precision = 2;
      if (this.value < 1) {
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
      }
      return precision;
    },

    handleFontSize() {
      return this.handlePrecision() > this.precision
        ? this.fontSize - (this.handlePrecision() - 2) / 2
        : this.fontSize;
    },

    numShorthand() {
      return numberFormat.shorthand(Number(this.value));
    },

    renderValue() {
      if (this.shortHand) {
        return this.numShorthand().value;
      }

      return Number(this.value);
    },
  },
};
</script>
<style lang="scss" scoped>
h2 {
  margin: 0;
}
</style>
  