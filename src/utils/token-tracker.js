import BigNumber from "bignumber.js";
import { getPrice } from "./home-wallet";
import ipfs from "./ipfs";
import teztools from "./teztools";

export default {
  async getTokens() {
    const { contracts: tokens } = await teztools.getPricefeed();

    return { ...tokens };
  },

  async calculateTokenData(token, priceFeed, xtzUsd) {
    const tokenPrice = await getPrice(
      token.tokenAddress,
      token.tokenId?.toString(),
      priceFeed
    );
    const element = tokenPrice;

    if (element) {
      if (element.thumbnailUri)
        element.thumbnailUri = ipfs.transformUri(element.thumbnailUri);

      const currentPrice = element?.currentPrice || false;
      const price = new BigNumber(currentPrice);

      const pricePair = element?.pairs.find(
        (el) => el.dex === "Quipuswap" && el.sides[1].symbol === "XTZ"
      );

      const mktCap = new BigNumber(element.totalSupply)
        .div(new BigNumber(10).pow(element.decimals))
        .times(element.usdValue);

      const calcSupply = new BigNumber(element.totalSupply).div(
        new BigNumber(10).pow(element.decimals)
      );

      const change1Day =
        price
          .minus(pricePair?.sides[0]?.dayClose)
          .div(pricePair?.sides[0]?.dayClose)
          .times(100)
          .toNumber() || 0;
      const change7Day =
        price
          .minus(pricePair?.sides[0]?.weekClose)
          .div(pricePair?.sides[0]?.weekClose)
          .times(100)
          .toNumber() || 0;
      const change30Day =
        price
          .minus(pricePair?.sides[0]?.monthClose)
          .div(pricePair?.sides[0]?.monthClose)
          .times(100)
          .toNumber() || 0;

      element.mktCap = isNaN(mktCap.toNumber()) ? 0 : mktCap.toNumber();
      element.change1Day = change1Day;
      element.change7Day = change7Day;
      element.change30Day = change30Day;
      element.volume24 = 0;
      element.calcSupply = calcSupply;

      for (let index = 0; index < element?.pairs?.length; index++) {
        const market = element?.pairs[index];
        element.pairs[index].lpPrice =
          (market.tvl / market.lptSupply) * xtzUsd || 0;
      }

      if (mktCap < 200000000) return element;
    }
  },
};
