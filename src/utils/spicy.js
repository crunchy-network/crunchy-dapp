import axios from "axios";

const makeRequest = async (uri) => {
  return axios.get(`https://spicyb.sdaotools.xyz${uri}`);
};

export default {
  async getTradingPoolsAndTokens() {
    return Promise.all([
      makeRequest("/api/rest/PoolListAll"),
      makeRequest("/api/rest/TokenList"),
    ]).then((res) => {
      return {
        pair_info: res[0].data.pair_info,
        tokens: res[1].data.tokens,
      };
    });
  },
};
