const {
  isTez,
  percentToDecimal,
  convertToMuTez,
  fromOpOpts,
} = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const DEX_FEE = 3;

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

function getSwapOutput(input, pair) {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);

  return toRet;
}

const directTransaction = (dex, trade, walletAddress, input, output) => {
  const tokenA = { ...trade.a };
  console.log(input, output, trade.poolId)
  console.log(fromOpOpts(convertToMuTez(trade.input, tokenA)));
  return [
    dex.contract.methods
      .swap(input, output, walletAddress, [[trade.poolId, true]])
      .toTransferParams(fromOpOpts(undefined)),
  ];
};

const invertTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .swap(input, output, walletAddres, [[trade.poolId, false]])
      .toTransferParams(fromOpOpts(undefined)),
  ];
};

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  console.log(input, output, trade)
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
