const { default: BigNumber } = require("bignumber.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { isTez, convertToMuTez, secondsFromNow, fromOpOpts } = require("../utils");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const FEE_DENOMINATOR = new BigNumber(1000000000000000000n);

function getFees(fees) {
  const { auctionFee, swapFee, interfaceFee } = fees;
  return auctionFee.plus(swapFee).plus(interfaceFee);
}

function calcFees(pair) {
  return getFees(pair.fee).div(FEE_DENOMINATOR);
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

const directTransaction = (dex, trade, walletAddres, input, output) => {
  const tokenA = { ...trade.a };

  return [
    dex.contract.methods
      .swap(
        null,
        [
          {
            direction: {
              a_to_b: [["unit"]],
            },
            pair_id: trade.poolId,
          },
        ],
        `${secondsFromNow(300)}`,
        walletAddres,
        walletAddres,
        input,
        output,
        null
      )
      .toTransferParams(fromOpOpts(convertToMuTez(trade.input, tokenA))),
  ];
};

const invertTransaction = (dex, trade, walletAddres, input, output) => {
  const tokenA = { ...trade.a };
  
  console.log(dex)
  return [
    dex.contract.methods
      .swap(
        null,
        [
          {
            direction: {
              b_to_a: [["unit"]],
            },
            pair_id: trade.poolId,
          },
        ],
        `${secondsFromNow(300)}`,
        walletAddres,
        walletAddres,
        input,
        output,
        null
      )
      .toTransferParams(fromOpOpts(convertToMuTez(trade.input, tokenA))),
  ];
};

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  console.log(dex, trade, input, output)
  const transfers =
    trade.direction === "Direct"
      ? directTransaction(dex, trade, walletAddres, input, output)
      : invertTransaction(dex, trade, walletAddres, input, output);
  if (!isTez(trade.a)) {
    return addTokenApprovalOperators(
      trade,
      walletAddres,
      input,
      transfers,
      tezos
    );
  } 
  return transfers;
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
