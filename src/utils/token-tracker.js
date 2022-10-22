import axios from "axios";
import BigNumber from "bignumber.js";
import ipfs from "./ipfs";
import teztools from "./teztools";

export default {
  async getTokens() {
    const { contracts: tokens } = await teztools.getPricefeed();

    return { ...tokens };
  },

  async calculateTokenData(token) {
    const element = token;

    if (element.thumbnailUri)
      element.thumbnailUri = ipfs.transformUri(element.thumbnailUri);

    const {
      data: [tokenInfo],
    } = await axios(
      `https://api.tzkt.io/v1/tokens?contract=${element.tokenAddress}`
    );

    if (tokenInfo) {
      const currentPrice = element?.currentPrice || false;
      const price = new BigNumber(currentPrice);

      const pricePair = element?.pairs.find(
        (el) => el.dex === "Quipuswap" && el.sides[1].symbol === "XTZ"
      );

      const mktCap = new BigNumber(tokenInfo.totalSupply)
        .div(new BigNumber(10).pow(element.decimals))
        .times(element.usdValue);

      const change1Day = price
        .minus(pricePair?.sides[0]?.dayClose)
        .div(pricePair?.sides[0]?.dayClose)
        .times(100)
        .toNumber();
      const change7Day = price
        .minus(pricePair?.sides[0]?.weekClose)
        .div(pricePair?.sides[0]?.weekClose)
        .times(100)
        .toNumber();
      const change30Day = price
        .minus(pricePair?.sides[0]?.monthClose)
        .div(pricePair?.sides[0]?.monthClose)
        .times(100)
        .toNumber();

      element.mktCap = isNaN(mktCap.toNumber()) ? 0 : mktCap.toNumber();
      element.change1Day = change1Day;
      element.change7Day = change7Day;
      element.change30Day = change30Day;
      element.volume24 = 0;

      return element;
    } else {
      return false;
    }
  },
};
