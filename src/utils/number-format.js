export default {
  shorthand(number, decimals = 2) {
    if (isNaN(number)) return { value: 0, suffix: "" };

    if (number < 1000) {
      return { value: number, suffix: "" };
    }
    if (number < 1000000) {
      return { value: (number / 1000).toFixed(decimals), suffix: "K" };
    }
    if (number < 1000000000) {
      return { value: (number / 1000000).toFixed(decimals), suffix: "M" };
    }
    if (number < 1000000000000) {
      return { value: (number / 1000000000).toFixed(decimals), suffix: "B" };
    }
    return { value: (number / 1000000000000).toFixed(decimals), suffix: "T" };
  },
};
