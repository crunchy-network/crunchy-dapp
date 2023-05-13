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

const getNewWeightedPoolEstimate = (routes) => {
  return routes.map((route) => getNewPoolEstimate(route));
};

const simulateNewTradeOutput = (estimatedPools, inputAmount = 1) => {
  if (!estimatedPools.length) {
    return { inputAmount: 1, outputAmount: 0 };
  }
  const { outputAmount } = getOutputOfTrade(inputAmount, estimatedPools);
  if (outputAmount === 0) {
    const input = 0.0001;
    const { outputAmount } = getOutputOfTrade(input, estimatedPools);
    return { input, outputAmount }
  }
  return { inputAmount, outputAmount };
};

const simulateNewWeightedTradeOutput = (estimatedPools, inputAmount = 1) => {
  if (!estimatedPools.length) {
    return { inputAmount: 1, outputAmount: 0 };
  }
  const { outputAmount } = getOutputOfWeightedTrade(
    inputAmount,
    estimatedPools
  );
  return { inputAmount, outputAmount };
};

const calculatePriceImpact = (trade) => {
  if (!trade.trades) return undefined;
  let estimatedPools, tradeOne, simulatedOutput;
  switch (trade.type) {
    case "weighted":
      estimatedPools = getNewWeightedPoolEstimate([...trade.trades]);
      break;
    default:
      estimatedPools = getNewPoolEstimate([...trade.trades]);
      break;
  }

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
  console.log([...trade.trades])
  console.log(estimatedPools)
  console.log(simulatedOutput, tradeOne)
  return (
    (1 - simulatedOutput.outputAmount / tradeOne.outputAmount) *
    100
  ).toFixed(2);
};

module.exports = {
  calculatePriceImpact,
};
