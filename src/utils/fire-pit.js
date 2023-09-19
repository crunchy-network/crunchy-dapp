// import axios from "axios";
import BigNumber from "bignumber.js";
import dexIndexer from "./dex-indexer";
import queryDipdup from "./queryDipdup";
import tzkt from "./tzkt";
// import teztools from "./teztools";

export default {
  async getCrunchBurned() {
    try {
      // const { data: resp } = await axios.get(
      //   "https://staging.api.tzkt.io/v1/tokens/balances?account=KT1CZMurPAjSfZqcn6LBUNUhG4byE6AJgDT6&token.contract=KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng&balance.gt=0&limit=10000&select=token,balance"
      // );

      const crnchy = await dexIndexer.getToken(
        process.env.VUE_APP_CONTRACTS_CRNCHY,
        0
      )[0];

      const totalSupply = new BigNumber(crnchy.totalSupply).div(
        new BigNumber(10).pow(crnchy.decimals)
      );

      const crunchyBurned = new BigNumber(500000000).minus(totalSupply);
      const crnchyPriceXtz = await queryDipdup.getTokenPriceXTZ(
        `${process.env.VUE_APP_CONTRACTS_CRNCHY}_0`
      );

      const burned = new BigNumber(crunchyBurned)
        .times(crnchyPriceXtz)
        .toNumber();

      const priceUsd = await tzkt.getXtzUsdPrice();

      return { burned: crunchyBurned.toNumber(), burnedUsd: priceUsd * burned };
    } catch (error) {
      console.log(error);
    }
  },
};
