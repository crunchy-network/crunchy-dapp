export default {
  shorthand(value, precision) {
    const number = precision
      ? parseFloat(value).toFixed(precision)
      : Number(value);
    if (isNaN(number)) return { value: 0, suffix: "" };
    if (number < 1000) {
      return { value: number, suffix: "" };
    } else if (number < 1000000) {
      const value = number / 1000;
      return { value, suffix: "K" };
    } else if (number < 1000000000) {
      const value = number / 1000000;
      return { value, suffix: "M" };
    } else if (number < 1000000000000) {
      const value = number / 1000000000;
      return { value, suffix: "B" };
    } else {
      return { value: number / 1000000000000, suffix: "T" };
    }
  },
};
