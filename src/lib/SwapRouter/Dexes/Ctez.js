const utils = require("../utils.js");
const tezCtezEstimator = require("../SwapRates/tezCtezEstimator.js");
const tokenTypes = require("../TokenTypes/index.js");

const FEE_DENOM = 1000;

const getSwapOutput = (input, pair) => {
  const inputMuTez = utils.convertToMuTez(input, pair.a);
  const tez = [pair.a, pair.b].find((token) => token.assetSlug === "tez");
  const ctez = [pair.a, pair.b].find((token) => token.assetSlug !== "tez");
  const toRet = tezCtezEstimator.calculateRate(
    utils.convertToMuTez(tez.pool, tez),
    utils.convertToMuTez(ctez.pool, ctez),
    inputMuTez,
    FEE_DENOM,
    pair.target,
    pair.a.tokenSymbol
  );
  return toRet.tokenOut;
};

const tezToCtez = (dex, trade, walletAddress, input, output, tezos) => {
  const toRet = dex.contract.methods
  .cashToToken(walletAddress, output, input, `${utils.secondsFromNow(1200)}`)
    .toTransferParams(utils.fromOpOpts(input));
  return toRet;
};

const cTezToTez = async (dex, trade, walletAddress, input, output, tezos) => {
  const transfers = [
    dex.contract.methods
    .tokenToCash(walletAddress, input, output, `${utils.secondsFromNow(1200)}`)
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

const getEntrypoint = (trade) => {
  if (utils.isTez(trade.a)) {
    return tezToCtez;
  }
  if (utils.isTez(trade.b)) {
    return cTezToTez;
  }
};

const buildDexOperation = async (dex, trade, walletAddress, tezos) => {
  const output = utils.convertToMuTez(trade.minOut, trade.b);
  const input = utils.convertToMuTez(trade.input, trade.a);
  const buildSwapParams = getEntrypoint(trade);
  return buildSwapParams(dex, trade, walletAddress, input, output, tezos);
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
