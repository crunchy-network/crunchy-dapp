const {
  percentToDecimal,
  isTez,
  isToken,
  convertToMuTez,
  fromOpOpts,
} = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const DEX_FEE = 0.3;

const getSwapOutput = (input, pair) => {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  return getAmmSwapOutput(inputAfterFee, pair);
};

const tezToToken = (dex, trade, walletAddress, tezos) => {
  const tokenA = { ...trade.a };
  const tokenB = { ...trade.b };
  return dex.methods
    .tezToTokenPayment(convertToMuTez(trade.minOut, tokenB), walletAddress)
    .toTransferParams(fromOpOpts(convertToMuTez(trade.input, tokenA)));
};

const tokenToTez = async (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers = [
    dex.methods
      .tokenToTezPayment(input, output, walletAddres)
      .toTransferParams(fromOpOpts(undefined)),
  ];

  return await addTokenApprovalOperators(
    trade,
    walletAddres,
    input,
    transfers,
    tezos
  );
};

const tokenToToken = (dex, trade) => {};

const getTransactionType = (trade) => {
  if (isTez(trade.a) && isToken(trade.b)) {
    return tezToToken;
  }
  if (isToken(trade.a) && isTez(trade.b)) {
    return tokenToTez;
  }
  if (isToken(trade.a) && isToken(trade.b)) {
    return tokenToToken;
  }
  throw new Error("Unsupported transation type \n", JSON.stringify(trade));
};

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const operation = getTransactionType(trade);
  return operation(dex.contract, trade, walletAddres, tezos);
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
