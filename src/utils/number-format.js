export default {
  shorthand(value, decimal = 2) {
    const number = Number(value);
    if (isNaN(number)) return { value: 0, suffix: "" };
    if (number < 1000) {
      return { value: number, suffix: "" };
    } else if (number < 1000000) {
      const value = number / 1000;
      console.log(number);
      console.log(value);
      console.log("_______________");
      return { value, suffix: "K" };
    } else if (number < 1000000000) {
      return { value: (number / 1000000).toFixed(decimal), suffix: "M" };
    } else if (number < 1000000000000) {
      return { value: (number / 1000000000).toFixed(decimal), suffix: "B" };
    } else {
      return { value: (number / 1000000000000).toFixed(decimal), suffix: "T" };
    }
  },
};
