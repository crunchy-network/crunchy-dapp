const { default: BigNumber } = require("bignumber.js");
const { addTokenApprovalOperators } = require("../TokenTypes");
const {
  isTez,
  isToken,
  secondsFromNow,
  convertToMuTez,
  fromOpOpts,
  isValidDexFee
} = require("../utils.js");
const { getAmmSwapOutput } = require("../SwapRates/amm");

const FEE_DENOMINATOR = new BigNumber(1000000000000000000n);

function getFees(fees) {
  const auctionFee = new BigNumber(fees.auctionFee);
  const swapFee = new BigNumber(fees.swapFee);
  const interfaceFee = new BigNumber(fees.interfaceFee);
  
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
  const feeAmount = input - inputAfterFee;
  if (!isValidDexFee(feeAmount, pair)) {
    return 0;
  }
  const output = getAmmSwapOutput(inputAfterFee, pair);
  const toRet = roundOutput(output, pair);
  return toRet;
};

const tezToToken = (transfer, trade, sender, input, tezos) => {
  return transfer.toTransferParams(fromOpOpts(+input));
};

const fromToken = async (transfer, trade, sender, input, tezos) => {
  const transfers = [transfer.toTransferParams(fromOpOpts(undefined))];

  return await addTokenApprovalOperators(
    trade,
    sender,
    input,
    transfers,
    tezos
  );
};

const getTransactionType = (trade) => {
  if (isTez(trade.a) && isToken(trade.b)) {
    return tezToToken;
  }
  if (isToken(trade.a)) {
    return fromToken;
  }
  throw new Error("Unsupported transation type \n", JSON.stringify(trade));
};

const directTransaction = (dex, trade, walletAddres, input, output, tezos) => {
  const transfer = dex.contract.methods.swap(
    null,
    [
      {
        direction: {
          a_to_b: [["unit"]],
        },
        pair_id: trade.poolId,
      },
    ],
    `${secondsFromNow(1200)}`,
    walletAddres,
    walletAddres,
    input,
    output,
    null
  )

  const operation = getTransactionType(trade);
  return operation(transfer, trade, walletAddres, input, tezos);
};

const invertTransaction = (dex, trade, walletAddres, input, output, tezos) => {
  const transfer = dex.contract.methods.swap(
    null,
    [
      {
        direction: {
          b_to_a: [["unit"]],
        },
        pair_id: trade.poolId,
      },
    ],
    `${secondsFromNow(1200)}`,
    walletAddres,
    walletAddres,
    input,
    output,
    null
  )

  const operation = getTransactionType(trade);
  return operation(transfer, trade, walletAddres, input, tezos);
};

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.minOut, trade.b);
  const transfers =
    trade.direction === "Direct"
      ? directTransaction(dex, trade, walletAddres, input, output, tezos)
      : invertTransaction(dex, trade, walletAddres, input, output, tezos);
  return transfers;
};

module.exports = {
  getSwapOutput,
  buildDexOperation,
};
