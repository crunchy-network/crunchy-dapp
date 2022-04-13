const BigNumber = require("bignumber.js");

const getAmmSwapOutput = (input, pair) => {
  //   const inputAfterFee = input * getDexFee(pair);
  const bPool = new BigNumber(pair.b.pool);
  const aPool = new BigNumber(pair.a.pool);
  const numerator = bPool.times(input);
  const denominator = aPool.plus(input);

  const toRet = numerator.div(denominator);
  return toRet.toNumber();
};

module.exports = {
  getAmmSwapOutput,
};
