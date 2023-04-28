const {
  percentToDecimal,
  convertToMuTez,
  secondsFromNow,
  fromOpOpts,
} = require("../utils");
const { getFlatCfmmOutput } = require("../SwapRates/flat-cfmm");
const { addTokenApprovalOperators } = require("../TokenTypes");
const config = require("./../config");

const DEX_FEE = 0.15;

const getSwapOutput = (input, pair) => {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  return getFlatCfmmOutput(inputAfterFee, pair);
};

const isCash = (token) => {
  return config.dexes.youves.cashTokens.includes(token.tokenSymbol);
};

const cashToToken = async (dex, trade, walletAddress, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);

  const transfers = [
    dex.methods
      .cashToToken(walletAddress, output, input, `${secondsFromNow(1200)}`)
      .toTransferParams(fromOpOpts(undefined)),
  ];
  return await addTokenApprovalOperators(
    trade,
    walletAddress,
    input,
    transfers,
    tezos
  );
};
const tokenToCash = async (dex, trade, walletAddress, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers = [
    dex.methods
      .tokenToCash(walletAddress, input, output, `${secondsFromNow(1200)}`)
      .toTransferParams(fromOpOpts(undefined)),
  ];
  return await addTokenApprovalOperators(
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
