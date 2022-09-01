const {
  convertToMuTez,
  secondsFromNow,
  percentToDecimal,
} = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const DEX_FEE = 0.003;

const getDexFee = (input, pair) => {
  const feeEst = input * DEX_FEE;
  const decimalMover = Math.pow(10, pair.a.decimals);
  const bigNumber = Math.round(feeEst * decimalMover);
  if (bigNumber < 1) {
    return 1 / decimalMover;
  }
  return bigNumber / decimalMover;
};

const getOutput = (output, token) => {
  const decimalMover = Math.pow(10, token.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

const getSwapOutput = (input, pair) => {
  var inputAfterFee = input - getDexFee(input, pair);
  if (inputAfterFee < 0) {
    inputAfterFee = 0;
  }
  const result = getAmmSwapOutput(inputAfterFee, pair);
  return getOutput(result, pair.b);
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
