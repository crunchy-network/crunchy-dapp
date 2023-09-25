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
      const precisedValue = parseFloat(value).toFixed(precision)
      return { value: precisedValue, suffix: "K" };
    } else if (number < 1000000000) {
      const value = number / 1000000;
      const precisedValue = parseFloat(value).toFixed(precision)
      return { value: precisedValue, suffix: "M" };
    } else if (number < 1000000000000) {
      const value = number / 1000000000;
      const precisedValue = parseFloat(value).toFixed(precision)
      return { value: precisedValue, suffix: "B" };
    } else {
      const value = number / 1000000000000;
      const precisedValue = parseFloat(value).toFixed(precision)
      return { value: precisedValue, suffix: "T" };
    }
  },
};
