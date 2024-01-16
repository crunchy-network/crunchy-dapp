const utils = require("../utils.js");
const flatCfmm = require("../SwapRates/flat-cfmm.js");
const tokenTypes = require("../TokenTypes/index.js");

const DEX_FEE = 0.15;

const getSwapOutput = (input, pair) => {
  const inputAfterFee = input * utils.percentToDecimal(DEX_FEE);
  const feeAmount = input - inputAfterFee;
  if (!utils.isValidDexFee(feeAmount, pair)) {
    return 0;
  }
  return flatCfmm.getFlatCfmmOutput(inputAfterFee, pair);
};

const isCash = (token) => {
  return ["XTZ"].includes(token.tokenSymbol);
};

const cashToToken = async (dex, trade, walletAddress, tezos) => {
  const input = utils.convertToMuTez(trade.input, trade.a);
  const output = utils.convertToMuTez(trade.minOut, trade.b);

  const transfers = [
    dex.methods
      .cashToToken(
        walletAddress,
        output,
        input,
        `${utils.secondsFromNow(1200)}`
      )
      .toTransferParams(utils.fromOpOpts(undefined)),
  ];
  return transfers;
};
const tokenToCash = async (dex, trade, walletAddress, tezos) => {
  const input = utils.convertToMuTez(trade.input, trade.a);
  const output = utils.convertToMuTez(trade.minOut, trade.b);
  const transfers = [
    dex.methods
      .tokenToCash(
        walletAddress,
        input,
        output,
        `${utils.secondsFromNow(1200)}`
      )
      .toTransferParams(utils.fromOpOpts(undefined)),
  ];
  return await tokenTypes.addTokenApprovalOperators(
    trade,
    walletAddress,
    input,
    transfers,
    tezos
  );
};

const getTransactionType = (trade) => {
  if (isCash(trade.a)) {
    return cashToToken;
  }
  if (isCash(trade.b)) {
    return tokenToCash;
  }
};
const buildDexOperation = (dex, trade, walletAddress, tezos) => {
  const operation = getTransactionType(trade);
  const op = operation(dex.contract, trade, walletAddress, tezos);
  return op;
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
