const {
  getOutputOfTrade,
  getOutputOfWeightedTrade,
} = require("./find-best-route");

const getNewPoolEstimate = (tradeList) => {
  return tradeList.map((t) => {
    const tokenAPool = t.a.pool + t.input;
    const tokenBPool = t.b.pool - t.output;
    return {
      ...t,
      a: { ...t.a, pool: tokenAPool },
      b: { ...t.b, pool: tokenBPool },
      inputAmount: 0,
      output: 0,
    };
  });
};

const simulateNewTradeOutput = (estimatedPools, inputAmount = 1) => {
  const { outputAmount } = getOutputOfTrade(inputAmount, estimatedPools);
  return { inputAmount, outputAmount };
};

const simulateNewWeightedTradeOutput = (estimatedPools, inputAmount = 1) => {
  const { outputAmount } = getOutputOfWeightedTrade(
    inputAmount,
    estimatedPools
  );
  return { inputAmount, outputAmount };
};

// For debugging purposes.
const printComparison = (trades, estimate) => {
  // console.log(trades, estimate);
  // var str = "";
  // for (var i = 0; i < trades.length; i++) {
  //   str = str.concat(` \n <<< dex ${i + 1}, ${trades[i].dex} >>> \n
  //       dex address: ${trades[i].dexAddress}
  //       pool A ${trades[i].a.tokenSymbol}\n
  //         ${trades[i].a.pool} vs  ${estimate[i].a.pool} \n
  //       pool B ${trades[i].b.tokenSymbol} \n
  //         ${trades[i].b.pool} vs  ${estimate[i].b.pool} \n
  //       input: ${trades[i].input} vs  ${estimate[i].input} \n
  //       output: ${trades[i].output} vs  ${estimate[i].output} \n
  //       diff: ${1 - estimate[i].output / trades[i].output} \n
  //     `);
  // }
  // console.debug(str);
};

const calculatePriceImpact = (trade) => {
  if (!trade.trades) return undefined;
  const estimatedPools = getNewPoolEstimate([...trade.trades]);
  const currPools = trade.trades.map((t) => ({
    dex: t.dex,
    dexAddress: t.dexAddress,
    input: t.input,
    output: t.output,
    a: { pool: t.a.pool, tokenSymbol: t.a.tokenSymbol },
    b: { pool: t.b.pool, tokenSymbol: t.b.tokenSymbol },
  }));
  let tradeOne, simulatedOutput;
  switch (trade.type) {
    case "weighted":
      tradeOne = simulateNewWeightedTradeOutput([...trade.trades]);
      simulatedOutput = simulateNewWeightedTradeOutput(estimatedPools);
      break;

    default:
      tradeOne = simulateNewTradeOutput([...trade.trades]);
      simulatedOutput = simulateNewTradeOutput(estimatedPools);
      break;
  }

  printComparison(currPools, simulatedOutput.estimatedPools);
  return (
    (1 - simulatedOutput.outputAmount / tradeOne.outputAmount) *
    100
  ).toFixed(2);
};

module.exports = {
  calculatePriceImpact,
};
