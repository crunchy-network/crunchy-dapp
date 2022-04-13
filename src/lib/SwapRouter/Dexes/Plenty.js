const { percentToDecimal, convertToMuTez } = require("../utils.js");
const { getAmmSwapOutput } = require("../SwapRates/amm");
const { addTokenApprovalOperators } = require("../TokenTypes");

const DEX_FEE = 0.35;

const getSwapOutput = (input, pair) => {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  return getAmmSwapOutput(inputAfterFee, pair);
};

const buildDexOperation = async (dex, trade, walletAddress, tezos) => {
  const output = convertToMuTez(trade.minOut, trade.b);
  const input = convertToMuTez(trade.input, trade.a);
  const transfers = [
    dex.contract.methods
      .Swap(output, walletAddress, trade.b.tokenAddress, trade.b.tokenId, input)
      .toTransferParams({
        mutez: true,
      }),
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
