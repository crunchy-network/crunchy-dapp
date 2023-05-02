const { default: BigNumber } = require("bignumber.js");
const { getQuipuCurveOutput } = require("../SwapRates/quipuCurve");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { convertToMuTez, secondsFromNow, isValidDexFee } = require("../utils");

const FEE_DENOMINATOR = new BigNumber(10000000000);

function getAmountIn(input, token) {
  return input * 10 ** token.decimals;
}

function getFees(fees) {
  const { liquidityProvidersFee, stakersFee, interfaceFee, devFee } = fees;

  return liquidityProvidersFee.plus(stakersFee).plus(interfaceFee).plus(devFee);
}

function calcFees(pair, swapRate) {
  return getFees(pair.fee).times(swapRate).idiv(FEE_DENOMINATOR);
}

function getSwapOutput(input, pair) {
  const swapRate = getQuipuCurveOutput(pair, getAmountIn(input, pair.a));
  const fees = calcFees(pair, swapRate);
  const inputAfterFee = input * fees;
  const feeAmount = input - inputAfterFee;
  if (!isValidDexFee(feeAmount, pair)) {
    return 0;
  }
  const output = swapRate.minus(fees);
  return output.div(10 ** pair.b.decimals).toNumber();
}

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers = [
    dex.contract.methods
      .swap(
        trade.poolId,
        trade.a.index,
        trade.b.index,
        input,
        output,
        `${secondsFromNow(300)}`
      )
      .toTransferParams({
        mutez: true,
      }),
  ];

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
