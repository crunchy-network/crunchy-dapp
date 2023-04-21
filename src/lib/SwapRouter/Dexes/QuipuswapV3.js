const { default: BigNumber } = require("bignumber.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const {
  secondsFromNow,
  convertToMuTez,
  percentToDecimal,
} = require("../utils.js");
const { getAmmSwapOutput } = require("../SwapRates/amm");
const {
  calculateXtoY,
  calculateYtoX,
} = require("../SwapRates/cfmm/helpers/swap");

const FEE_DENOMINATOR = new BigNumber(10000);
const DEX_FEE = 0.3;

function getFees(fees) {
  const { feeBps } = fees;
  return feeBps;
}

function calcFees(pair) {
  return getFees(pair.fee).div(FEE_DENOMINATOR);
}

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

const getSwapOutput = async (input, pair) => {
  console.log(pair);
  const p = {
    s: {
      ticks: pair.ticks,
      lastCumulativesBuffer: pair.lastCumulativesBuffer,
      curTickIndex: pair.curTickIndex,
      curTickWitness: pair.curTickWitness,
      sqrtPrice: BigNumber(pair.sqrtPrice),
      liquidity: pair.liquidity,
      constants: {
        feeBps: BigNumber(pair.feeBps),
        factoryAddress: BigNumber(pair.factoryAddress),
      }
    },
    dx: input,
  }
  // const inputAfterFee = input * (1 - calcFees(pair));
  // const inputAfterFee = input * percentToDecimal(DEX_FEE);
  // const output = getAmmSwapOutput(inputAfterFee, pair);
  // const toRet = roundOutput(output, pair);
  // return toRet;
  const output = calculateXtoY(p);
  console.log(output)
  return output;
};

const directTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .x_to_y(input, `${secondsFromNow(300)}`, 1, walletAddres, null)
      .toTransferParams({
        mutez: true,
      }),
  ];
};

const invertTransaction = (dex, trade, walletAddres, input, output) => {
  return [
    dex.contract.methods
      .y_to_x(input, `${secondsFromNow(300)}`, 1, walletAddres, null)
      .toTransferParams({
        mutez: true,
      }),
  ];
};
const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  console.log(trade);
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
