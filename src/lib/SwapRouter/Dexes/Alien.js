const { default: BigNumber } = require("bignumber.js");
const { isTez, convertToMuTez } = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const FEE_DENOMINATOR = new BigNumber(1000000000000000000n);

function getFees(fees) {
  const { buyback, stake, dev } = fees;
  const interfaceFee = fees.interface;

  return buyback.plus(stake).plus(interfaceFee).plus(dev);
}

function calcFees(pair) {
  return getFees(pair.fee).idiv(FEE_DENOMINATOR);
}

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

function getSwapOutput(input, pair) {
  const inputAfterFee = input * (1 - calcFees(pair));
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);

  return toRet;
}

const directTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .swap(input, output, walletAddres, [trade.pool_id, true])
      .toTransferParams({
        mutez: true,
      }),
  ];
};

const invertTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .swap(input, output, walletAddres, [trade.pool_id, false])
      .toTransferParams({
        mutez: true,
      }),
  ];
};

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers =
    trade.direction === "Direct"
      ? directTransaction(dex, trade, walletAddres, input, output)
      : invertTransaction(dex, trade, walletAddres, input, output);

  if (!isTez(trade.a)) {
    return addTokenApprovalOperators(
      trade,
      walletAddres,
      input,
      transfers,
      tezos
    );
  }
  return transfers;
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
