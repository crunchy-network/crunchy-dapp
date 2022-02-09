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
    return makeReqest("/token/prices").then((res) => {
      return res.data;
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
          (el.tokenAddress === token.address && el.tokenId === token.tokenId) ||
          el.address === token.address
        );
      });
    }
  },
};
