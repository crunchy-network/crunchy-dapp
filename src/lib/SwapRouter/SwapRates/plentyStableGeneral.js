/* eslint-disable camelcase */
const util = (x, y) => {
  const plus = x + y;
  const minus = x - y;
  const plus_2 = plus * plus;
  const plus_4 = plus_2 * plus_2;
  const plus_8 = plus_4 * plus_4;
  const plus_7 = plus_4 * plus_2 * plus;
  const minus_2 = minus * minus;
  const minus_4 = minus_2 * minus_2;
  const minus_8 = minus_4 * minus_4;
  const minus_7 = minus_4 * minus_2 * minus;
  return {
    first: plus_8 - minus_8,
    second: 8 * (minus_7 + plus_7),
  };
};

const newton = (x, y, dx, dy, u, n) => {
  let dy1 = dy;
  let new_util = util(x + dx, y - dy);
  let new_u = new_util.first;
  let new_du_dy = new_util.second;
  while (n !== 0) {
    new_util = util(x + dx, y - dy1);
    new_u = new_util.first;
    new_du_dy = new_util.second;
    dy1 = dy1 + (new_u - u) / new_du_dy;
    n = n - 1;
  }
  return dy1;
};

const newton_dx_to_dy = (x, y, dx, rounds) => {
  const utility = util(x, y);
  const u = utility.first;
  const dy = newton(x, y, dx, 0, u, rounds);
  return dy;
};

const getTokenSupply = (token) => {
  return token.pool * token.precision * Math.pow(10, token.decimals);
};

const calculateTokensOutGeneralStable = (
  input,
  Exchangefee,
  inputToken,
  outputToken
) => {
  input = input * Math.pow(10, inputToken.decimals);
  const tokenIn_supply = getTokenSupply(inputToken);
  const tokenOut_supply = getTokenSupply(outputToken);

  const dy = newton_dx_to_dy(
    tokenIn_supply,
    tokenOut_supply,
    input * inputToken.precision,
    5
  );
  const fee = dy / Exchangefee;
  let tokenOut_amt = (dy - fee) / outputToken.precision;

  tokenOut_amt = tokenOut_amt / Math.pow(10, outputToken.decimals);
  const tokenOut_amount = tokenOut_amt;

  return tokenOut_amount;
};

module.exports = {
  calculateTokensOutGeneralStable,
};
