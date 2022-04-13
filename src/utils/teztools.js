import axios from "axios";
import farmUtils from "./farm";

const makeReqest = async (uri) => {
  return axios.get(`${process.env.VUE_APP_TEZTOOLS_API_URL}${uri}`);
};

export default {
  async getCrunchPricefeed() {
    return makeReqest(
      `/token/${process.env.VUE_APP_CONTRACTS_CRUNCH}_0/price`
    ).then((res) => {
      return res.data;
    });
  },

  async getPricefeed() {
    return makeReqest("/v1/prices").then((res) => {
      const ret = res.data;
      ret.contracts.push({
        symbol: "MTTR",
        name: "Matter",
        tokenAddress: "KT1K4jn23GonEmZot3pMGth7unnzZ6EaMVjY",
        tokenId: 0,
        decimals: 12,
        type: "fa2",
        thumbnailUri: "ipfs://QmZ3BWTnxAp87yfKnUGka9UeQLhHjMkDAB3KTo1UChhQas",
        shouldPreferSymbol: false,
        usdValue: 0,
        pairs: [],
      });
      return ret;
    });
  },

  findTokenInPriceFeed(token, feed) {
    if (farmUtils.isFa1(token)) {
      return feed.find((el) => {
        return (
          el.tokenAddress === token.address || el.address === token.address
        );
      });
    } else {
      return feed.find((el) => {
        return (
          (el.tokenAddress === token.address &&
            el.tokenId === parseInt(token.tokenId)) ||
          el.address === token.address
        );
      });
    }
  },
};
