const { default: BigNumber } = require("bignumber.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { convertToMuTez, secondsFromNow } = require("../utils");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const FEE_DENOMINATOR = new BigNumber(1000000000000000000);

function getFees(fees) {
  const { auctionFee, swapFee, interfaceFee } = fees;

  return auctionFee.plus(swapFee).plus(interfaceFee);
}

function calcFees(pair) {
  return getFees(pair.fee).idiv(FEE_DENOMINATOR);
}

const roundOutput = (output, pair) => {
  const decimalMover = Math.pow(10, pair.b.decimals);
  const bigNumber = parseFloat(Math.floor(output * decimalMover));
  return bigNumber / decimalMover;
};

const getSwapOutput = (input, pair) => {
  const inputAfterFee = input * (1 - calcFees(pair));
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);

  return toRet;
};

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
