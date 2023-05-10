const { default: BigNumber } = require("bignumber.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { secondsFromNow, convertToMuTez } = require("../utils.js");
const {
  calculateXToY,
  calculateYToX,
} = require("../SwapRates/cfmm/helpers/swap");

const getSwapOutput = (input, pair) => {
  const p = {
    s: {
      ticks: pair.ticks,
      lastCumulativesBuffer: pair.cumulativesBuffer[pair.lastCumulativesBuffer],
      curTickIndex: BigNumber(pair.curTickIndex),
      curTickWitness: BigNumber(pair.curTickWitness),
      sqrtPrice: BigNumber(pair.sqrtPrice),
      liquidity: BigNumber(pair.liquidity),
      constants: {
        feeBps: BigNumber(pair.fee.feeBps),
        factoryAddress: pair.factoryAddress,
      },
    },
  };

  const decimalMoverA = Math.pow(10, pair.a.decimals);
  const decimalMoverB = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(input * decimalMoverA));
  const output =
    pair.direction === "Direct"
      ? calculateXToY(p.s, BigNumber(bigNumber)).output
      : calculateYToX(p.s, BigNumber(bigNumber)).output;
  const bigNumberOutput = parseFloat(output / decimalMoverB);
  return bigNumberOutput;
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
