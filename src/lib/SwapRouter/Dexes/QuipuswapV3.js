const { default: BigNumber } = require("bignumber.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { secondsFromNow, convertToMuTez, percentToDecimal } = require("../utils.js");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const FEE_DENOMINATOR = new BigNumber(10000);
const DEX_FEE = 0.1;

function getFees(fees) {
  const { feeBps } = fees;
  return feeBps;
}

function calcFees(pair) {
  return getFees(pair.fee).div(FEE_DENOMINATOR);
}

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

const getSwapOutput = (input, pair) => {
  // const inputAfterFee = input * (1 - calcFees(pair));
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);
  return toRet;
};

const directTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .x_to_y(input, `${secondsFromNow(300)}`, 1, walletAddres, null)
      .toTransferParams({
        mutez: true,
      }),
  ];
};

const invertTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .y_to_x(input, `${secondsFromNow(300)}`, 1, walletAddres, null)
      .toTransferParams({
        mutez: true,
      }),
  ];
};
const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  console.log(trade)
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers =
    trade.direction === "Direct"
      ? directTransaction(dex, trade, walletAddres, input, output)
      : invertTransaction(dex, trade, walletAddres, input, output);

  return addTokenApprovalOperators(
    trade,
    walletAddres,
    input,
    transfers,
    tezos
  );
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
