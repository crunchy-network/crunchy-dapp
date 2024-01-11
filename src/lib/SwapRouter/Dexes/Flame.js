const {
  isTez,
  isToken,
  percentToDecimal,
  convertToMuTez,
  fromOpOpts,
  isValidDexFee,
} = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const DEX_FEE = 0.3;

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

function getSwapOutput(input, pair) {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  const feeAmount = input - inputAfterFee;
  if (!isValidDexFee(feeAmount, pair)) {
    return 0;
  }
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);

  return toRet;
}

const tezToToken = (transfer, trade, sender, input, tezos) => {
  const tokenA = { ...trade.a };

  return transfer.toTransferParams(fromOpOpts(+input, tokenA));
};

const fromToken = async (transfer, trade, sender, input, tezos) => {
  const transfers = [transfer.toTransferParams(fromOpOpts(undefined))];

  return await addTokenApprovalOperators(
    trade,
    sender,
    input,
    transfers,
    tezos
  );
};

const getTransactionType = (trade) => {
  if (isTez(trade.a) && isToken(trade.b)) {
    return tezToToken;
  }
  if (isToken(trade.a)) {
    return fromToken;
  }
  throw new Error("Unsupported transation type \n", JSON.stringify(trade));
};

const directTransaction = (dex, trade, walletAddres, input, output, tezos) => {
  const transfer = dex.contract.methods.swap(input, output, walletAddres, [
    [trade.poolId, true],
  ]);
  const operation = getTransactionType(trade);

  return operation(transfer, trade, walletAddres, input, tezos);
};

const invertTransaction = (dex, trade, walletAddres, input, output, tezos) => {
  const transfer = dex.contract.methods.swap(input, output, walletAddres, [
    [trade.poolId, false],
  ]);

  const operation = getTransactionType(trade);
  return operation(transfer, trade, walletAddres, input, tezos);
};

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers =
    trade.direction === "Direct"
      ? directTransaction(dex, trade, walletAddres, input, output, tezos)
      : invertTransaction(dex, trade, walletAddres, input, output, tezos);

  return transfers;
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
