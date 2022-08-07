const { default: BigNumber } = require("bignumber.js");
const { getQuipuCurveOutput } = require("../SwapRates/quipuCurve");
const { addTokenApprovalOperators } = require("../TokenTypes");
const { convertToMuTez, secondsFromNow } = require("../utils");

const FEE_DENOMINATOR = new BigNumber(10000000000);

function getAmountIn(input, token) {
  return input * 10 ** token.decimals;
}

function getFees(fees) {
  const { liquidityProvidersFee, stakersFee, interfaceFee, devFee } = fees;

  return liquidityProvidersFee.plus(stakersFee).plus(interfaceFee).plus(devFee);
}

function calcFees(pair, swapRate) {
  return getFees(pair.fee).times(swapRate).idiv(FEE_DENOMINATOR);
}

function getSwapOutput(input, pair) {
  const swapRate = getQuipuCurveOutput(
    pair.a.infoIndex,
    pair.b.infoIndex,
    getAmountIn(input, pair.a),
    pair.pool
  );
  const fees = calcFees(pair, swapRate);
  const output = swapRate.minus(fees);
  return output.div(10 ** pair.b.decimals).toNumber();
}

const buildDexOperation = (dex, trade, walletAddres, tezos) => {
  const input = convertToMuTez(trade.input, trade.a);
  const output = convertToMuTez(trade.output, trade.b);
  console.log(dex);
  const transfers = [
    dex.contract.methods
      .swap(
        trade.pool.poolId,
        trade.a.infoIndex,
        trade.b.infoIndex,
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
