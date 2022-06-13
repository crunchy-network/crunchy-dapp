const QuipuStable = require("./src/utils/quipuswap-stable");
const swapRate = require("./src/lib/SwapRouter/SwapRates/quipuCurve");
const { default: BigNumber } = require("bignumber.js");
const {
  buildSwapPairsFromData,
} = require("./src/lib/SwapRouter/DataParsers/quipu-stable-data-parser");
const { getSwapOutput } = require("./src/lib/SwapRouter/Dexes/QuipuswapStable");

function getFees(fees) {
  const { liquidityProvidersFee, stakersFee, interfaceFee, devFee } = fees;

  return liquidityProvidersFee.plus(stakersFee).plus(interfaceFee).plus(devFee);
}

const FEE_DENOMINATOR = new BigNumber(10000000000);

async function test() {
  const data = await QuipuStable.getQuipuswapStableDexes();

  //   //   const kusd_usdtz = data[0];
  //   const usdce_uusd = data[1];
  //   console.log(data[1]);
  //   const output = swapRate.getQuipuCurveOutput(1, 0, 10 * 10 ** 12, usdce_uusd);
  //   const fee = getFees(usdce_uusd.fee).times(output).idiv(FEE_DENOMINATOR);
  //   console.log(fee.div(10 ** 6).toNumber());
  //   console.log(
  //     output
  //       .minus(fee)
  //       .div(10 ** 6)
  //       .toNumber()
  //   );

  const pairs = buildSwapPairsFromData(data);
  pairs.map((pair, index) => {
    console.log(pair.a.tokenSymbol, pair.b.tokenSymbol, index);
  });
  const firstPair = pairs[11];
  console.log(firstPair.a.tokenSymbol, firstPair.b.tokenSymbol);
  const output = getSwapOutput(10, firstPair);
  console.log(output);
  const newNum = new BigNumber(10000);

  console.log(newNum instanceof BigNumber);
}

test();
