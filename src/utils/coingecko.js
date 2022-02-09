import axios from "axios";

const makeReqest = async (uri, params = {}) => {
  return axios.get(`${process.env.VUE_APP_COINGECKO_API_URL}${uri}`, {
    params,
  });
};

export default {
  async getXtzUsdPrice() {
    return makeReqest(`/v3/simple/price`, {
      ids: "tezos",
      vs_currencies: "usd",
    }).then((res) => {
      return res.data.tezos.usd;
    });
  },
};
