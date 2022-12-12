const Dexes = require("./Dexes");
const { getContractAndStorage } = require("./utils");

const buildOperationParams = async (route, tezos, walletAddress) => {
  let params = [];
  for (let trades of route.slippageTrades) {
    if (!Array.isArray(trades)) {
      trades = [ trades ];
    }
    for (const trade of trades) {
      const c = await getContractAndStorage(trade.dexAddress, tezos);
      const dex = Dexes[trade.dex];
      if (dex) {
        params = params.concat(
          await dex.buildDexOperation(c, trade, walletAddress, tezos)
        );
      } else {
        throw new Error(
          `Unknown Dex: ${trade.dex}, address: ${trade.dexAddress}`
        );
      }
    }
  }
  return params;
};

module.exports = {
  buildOperationParams,
};
