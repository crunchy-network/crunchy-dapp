const {
  percentToDecimal,
  convertToMuTez,
  secondsFromNow,
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
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);

  return toRet;
}

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers = [
    dex.contract.methods
      .swap(
        trade.poolId,
        trade.a.index,
        trade.b.index,
        input,
        output,
        `${secondsFromNow(300)}`
      )
      .toTransferParams({
        mutez: true,
      }),
  ];

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
