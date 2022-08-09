import axios from "axios";
import BigNumber from "bignumber.js";
import teztools from "./teztools";

export default {
  async getCrunchBurned() {
    try {
      const { data: resp } = await axios.get(
        "https://staging.api.tzkt.io/v1/tokens/balances?account=KT1CZMurPAjSfZqcn6LBUNUhG4byE6AJgDT6&token.contract=KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng&balance.gt=0&limit=10000&select=token,balance"
      );

      const burned = new BigNumber(resp[0].balance)
        .div(new BigNumber(10).pow(8))
        .toNumber();

      const price = await teztools.getCrunchPricefeed();

      return { burned, burnedUsd: price.usdValue * burned };
    } catch (error) {
      console.log(error);
    }
  },
};
