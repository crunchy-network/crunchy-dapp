import axios from "axios";
import { BigNumber } from "bignumber.js";

const makeRequest = async (uri, params = {}) => {
  return axios.get(`${process.env.VUE_APP_TZKT_API_URL}${uri}`, {
    params: { limit: 1000, ...params },
  });
};

const makeFutureRequest = async (uri, params = {}) => {
  return axios.get(`${process.env.VUE_APP_TZKT_API_FUTURE_URL}${uri}`, {
    params: { limit: 1000, ...params },
  });
};

export default {
  async getBigMapKeys(id) {
    return makeRequest(`/v1/bigmaps/${id}/keys`);
  },

  async getContractBigMap(address, name, params = {}) {
    return makeRequest(`/v1/contracts/${address}/bigmaps/${name}`, params);
  },

  async getContractBigMapKeys(address, name, params = {}) {
    return makeRequest(`/v1/contracts/${address}/bigmaps/${name}/keys`, params);
  },

  async getContractStorage(address) {
    return makeRequest(`/v1/contracts/${address}/storage`);
  },

  async getTokenBalance(address, contract, tokenId) {
    const res = await makeFutureRequest(`/v1/tokens/balances`, {
      select: "balance",
      account: address,
      "token.contract": contract,
      "token.tokenId": tokenId,
      limit: 1,
    });
    if (res.data && res.data.length) {
      return new BigNumber(res.data[0]);
    }
    return new BigNumber(0);
  },

  async getTransactions(params = {}) {
    return makeRequest("/v1/operations/transactions", {
      "sort.desc": "level",
      ...params,
    });
  },
};
