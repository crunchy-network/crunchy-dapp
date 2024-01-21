// import axios from "axios";
import BigNumber from "bignumber.js";
import dexIndexer from "./dex-indexer";
import tzkt from "./tzkt";

export default {
  async getCrunchBurned() {
    try {
      let crnchy = await dexIndexer.getToken(
        process.env.VUE_APP_CONTRACTS_CRNCHY,
        "0"
      );
      crnchy = crnchy[0];

      const totalSupply = new BigNumber(crnchy.totalSupply).div(
        new BigNumber(10).pow(crnchy.decimals)
      );

      const crunchyBurned = new BigNumber(500000000).minus(totalSupply);

      const crnchyPriceXtz = crnchy?.quotes.find(
        (el) => el.token.tokenAddress === "tez"
      )?.quote;

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
