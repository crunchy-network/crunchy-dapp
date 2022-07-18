const Dexes = require("./Dexes");
const { getContractAndStorage } = require("./utils");

const buildOperationParams = async (route, tezos, walletAddress) => {
  let params = [];
  for (var i = 0; i < route.slippageTrades.length; i++) {
    const trade = route.slippageTrades[i];
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
  return params;
};

module.exports = {
  buildOperationParams,
};
