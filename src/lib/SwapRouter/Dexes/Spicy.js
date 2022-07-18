const {
  percentToDecimal,
  convertToMuTez,
  secondsFromNow,
} = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const DEX_FEE = 0.3;

const getSwapOutput = (input, pair) => {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  return getAmmSwapOutput(inputAfterFee, pair);
};

const buildDexOperation = async (dex, trade, walletAddress, tezos) => {
  const output = convertToMuTez(trade.minOut, trade.b);
  const input = convertToMuTez(trade.input, trade.a);
  const transfers = [
    dex.contract.methodsObject
      .swap_exact_for_tokens({
        _to: walletAddress,
        amountIn: input,
        amountOutMin: output,
        deadline: `${secondsFromNow(300)}`,
        tokenIn: {
          fa2_address: trade.a.tokenAddress,
          token_id: trade.a.contractType === "fa2" ? trade.a.tokenId : null,
        },
        tokenOut: {
          fa2_address: trade.b.tokenAddress,
          token_id: trade.b.contractType === "fa2" ? trade.b.tokenId : null,
        },
      })
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
