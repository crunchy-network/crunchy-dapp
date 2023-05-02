const {
  calculateTokensOutGeneralStable,
} = require("../SwapRates/plentyStableGeneral");
const { addTokenApprovalOperators } = require("../TokenTypes");
const {
  convertToMuTez,
  fromOpOpts,
  percentToDecimal,
  isValidDexFee,
} = require("../utils");

const DEX_FEE = 1000;

const getSwapOutput = (input, pair) => {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  const feeAmount = input - inputAfterFee;
  if (!isValidDexFee(feeAmount, pair)) {
    return 0;
  }
  const toRet = calculateTokensOutGeneralStable(input, DEX_FEE, pair.a, pair.b);
  return toRet;
};

const buildDexOperation = async (dex, trade, walletAddress, tezos) => {
  const output = convertToMuTez(trade.minOut, trade.b);
  const input = convertToMuTez(trade.input, trade.a);
  const transfers = [
    dex.contract.methods
      .Swap(output, walletAddress, trade.b.tokenAddress, trade.b.tokenId, input)
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

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
