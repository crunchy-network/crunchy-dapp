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
    return makeRequest(`/v1/bigmaps/${id}/keys?select=key,value&active=true`);
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
  async getXtzUsdPrice() {
    const {
      data: { usd: xtzUsd },
    } = await makeRequest("/v1/quotes/last");

    return xtzUsd;
  },
  async getXtzUsdHistory(param = { limit: 10000, sort: "asc" }) {
    return makeRequest(
      `/v1/statistics/daily?quote=usd&select.values=date,quote&date.gt=2018-01-01T00:00:00Z&limit=${param.limit}&sort.${param.sort}=date`
    ).then((res) => {
      return res.data;
    });
  },
  async getTokenHoldersByBalance(contractAddress, minTokens) {
    let filteredAddresses = [];
    let offset = 0;
    const limit = 1000;
    const fetchAddresses = async () => {
      const response = await makeRequest(
        `/v1/tokens/balances?token.contract=${contractAddress}&balance.ge=${minTokens}&select=account.address%20as%20holder&offset=${offset}&limit=${limit}`
      );
      filteredAddresses = [...filteredAddresses, ...response.data];
      offset += limit;
      if (response.data.length === limit) {
        await fetchAddresses();
      }
    };
    await fetchAddresses();
    return filteredAddresses;
  },
};
