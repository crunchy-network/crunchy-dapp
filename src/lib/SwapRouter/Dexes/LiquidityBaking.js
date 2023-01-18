const {
  percentToDecimal,
  isTez,
  isToken,
  secondsFromNow,
  convertToMuTez,
  fromOpOpts,
} = require("../utils.js");
const { getAmmSwapOutput } = require("../SwapRates/amm");
const { addTokenApprovalOperators } = require("../TokenTypes");
const DEX_FEE = 0.1;
const BURN_FEE = 0.1;

const getSwapOutput = (input, pair) => {
  const inputAfterBurn = input * percentToDecimal(BURN_FEE);
  const inputAfterFee = inputAfterBurn * percentToDecimal(BURN_FEE);
  return getAmmSwapOutput(inputAfterFee, pair);
};

const dexterXtzToToken = (dex, trade, walletAddress, tezos) => {
  const xtz = { ...trade.a };
  const token = { ...trade.b };

  const timestamp = secondsFromNow(300);
  const toRet = dex.methods
    .xtzToToken(
      walletAddress,
      convertToMuTez(trade.minOut, token),
      `${timestamp}`
    )
    .toTransferParams(fromOpOpts(convertToMuTez(trade.input, xtz)));
  return toRet;
};

const dexterTokenToXtz = async (dex, trade, walletAddress, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const timestamp = secondsFromNow(300);
  const transfers = [
    dex.methods
      .tokenToXtz(walletAddress, input, output, `${timestamp}`)
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
const dexterTokenToToken = (dex, trade, walletAddress, tezos) => {};

const getDexterTransactionType = (trade) => {
  if (isTez(trade.a) && isToken(trade.b)) {
    return dexterXtzToToken;
  }
  if (isToken(trade.a) && isTez(trade.b)) {
    return dexterTokenToXtz;
  }
  if (isToken(trade.a) && isToken(trade.b)) {
    return dexterTokenToToken;
  }
  throw new Error("Unsupported transation type \n", JSON.stringify(trade));
};
const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const operation = getDexterTransactionType(trade);

  return operation(dex.contract, trade, walletAddres, tezos);
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
