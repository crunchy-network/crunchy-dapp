const {
  percentToDecimal,
  convertToMuTez,
  secondsFromNow,
  isValidDexFee
} = require("../utils.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const DEX_FEE = 0.3;
// const NDF = 0.003;

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

function getSwapOutput(input, pair) {
  const inputAfterFee = input * percentToDecimal(DEX_FEE);
  const feeAmount = input - inputAfterFee;
  if (!isValidDexFee(feeAmount, pair)) {
    return 0;
  }
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);

  return toRet;
}

const directTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .swap(
        [
          {
            operation: {
              a_to_b: [["unit"]],
            },
            pair_id: trade.poolId,
          },
        ],
        input,
        output,
        walletAddres,
        `${secondsFromNow(1200)}`
      )
      .toTransferParams({
        mutez: true,
      }),
  ];
};

const invertTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .swap(
        [
          {
            operation: {
              b_to_a: [["unit"]],
            },
            pair_id: trade.poolId,
          },
        ],
        input,
        output,
        walletAddres,
        `${secondsFromNow(1200)}`
      )
      .toTransferParams({
        mutez: true,
      }),
  ];
};
const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers =
    trade.direction === "Direct"
      ? directTransaction(dex, trade, walletAddres, input, output)
      : invertTransaction(dex, trade, walletAddres, input, output);

  return addTokenApprovalOperators(
    trade,
    walletAddres,
    input,
    transfers,
    tezos
  );
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
