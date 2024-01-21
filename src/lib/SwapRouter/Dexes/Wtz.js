const {
  fromOpOpts,
  convertToMuTez,
  getContractAndStorage,
} = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const BigNumber = require("bignumber.js");

const UNWRAP_FEE = 0.001;

const calcXtzToWtz = (input, pair) => {
  return BigNumber(input)
    .times(pair.swapRatio)
    .div(pair.swapRatioPrecision)
    .toNumber()
    .toFixed(6);
};

const calcWtzToXtz = (input, pair) => {
  return BigNumber(input)
    .times(pair.swapRatioPrecision)
    .div(pair.swapRatio)
    .times(1 - UNWRAP_FEE)
    .toNumber()
    .toFixed(6);
};

const getSwapOutput = (input, pair) => {
  return Number(
    pair.a.assetSlug === "tez"
      ? calcXtzToWtz(input, pair)
      : calcWtzToXtz(input, pair)
  );
};

const buildDexOperation = async (dex, trade, walletAddress, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  // const output = convertToMuTez(trade.output, trade.b);

  const { contract: proxy } = await getContractAndStorage(
    process.env.VUE_APP_CONTRACTS_WTZ_PROXY,
    tezos
  );

  let transfers = [];
  if (trade.a.assetSlug === "tez") {
    return proxy.methods
      .wrap(walletAddress)
      .toTransferParams(fromOpOpts(input));
  } else {
    transfers = [
      proxy.methods
        .unwrap(input, walletAddress)
        .toTransferParams(fromOpOpts(undefined)),
    ];
  }

  return await addTokenApprovalOperators(
    trade,
    walletAddress,
    input,
    transfers,
    tezos
  );
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
