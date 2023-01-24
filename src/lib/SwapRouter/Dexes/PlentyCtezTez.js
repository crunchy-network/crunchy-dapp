const ctezEstimator = require("../SwapRates/tezCtezEstimator");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { convertToMuTez, isTez, fromOpOpts } = require("../utils");

const FEE_DENOM = 1000;

const getSwapOutput = (input, pair) => {
  const inputMuTez = convertToMuTez(input, pair.a);
  const tez = [pair.a, pair.b].find((token) => token.assetSlug === "tez");
  const ctez = [pair.a, pair.b].find((token) => token.assetSlug !== "tez");
  const toRet = ctezEstimator.calculateRate(
    convertToMuTez(tez.pool, tez),
    convertToMuTez(ctez.pool, ctez),
    inputMuTez,
    FEE_DENOM,
    pair.target,
    pair.a.tokenSymbol
  );
  return toRet.tokenOut;
};

const tezToCtez = (dex, trade, walletAddress, input, output, tezos) => {
  const toRet = dex.contract.methods
    .tez_to_ctez(output, walletAddress)
    .toTransferParams(fromOpOpts(input));
  return toRet;
};

const cTezToTez = async (dex, trade, walletAddress, input, output, tezos) => {
  const transfers = [
    dex.contract.methods
      .ctez_to_tez(input, output, walletAddress)
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

const getEntrypoint = (trade) => {
  if (isTez(trade.a)) {
    return tezToCtez;
  }
  if (isTez(trade.b)) {
    return cTezToTez;
  }
};

const buildDexOperation = async (dex, trade, walletAddress, tezos) => {
  const output = convertToMuTez(trade.minOut, trade.b);
  const input = convertToMuTez(trade.input, trade.a);
  const buildSwapParams = getEntrypoint(trade);
  return buildSwapParams(dex, trade, walletAddress, input, output, tezos);
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
