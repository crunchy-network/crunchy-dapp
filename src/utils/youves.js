const axios = require("axios");

const getContractStorage = async (dexAddress) => {
  return axios.get(`https://api.tzkt.io/v1/contracts/${dexAddress}/storage`);
};

module.exports = {
  async getTradingPools() {
    // for future reference, this is the query to youves API to get their dexes
    // const query = `
    //     query MyQuery {
    //         trade(order_by: {id: desc, dex_contract_address: asc}, distinct_on: dex_contract_address) {
    //           dex_contract_address
    //           price
    //           symbol
    //           token_1_address
    //           token_1_amount
    //           token_1_pool
    //           token_2_address
    //           token_2_amount
    //           token_2_pool
    //           type
    //           id
    //         }
    //       }
    // `;
    // const resp = await axios.post(
    //   "https://youves-mainnet-indexer.prod.gke.papers.tech/v1/graphql",
    //   {
    //     query,
    //   }
    // );
    // return resp.data.data.trade;
    const youvesDexes = [
      {
        dexAddress: "KT1AVbWyM8E7DptyBCu4B5J5B7Nswkq7Skc6",
        cashSymbol: "kUSD",
        tokenSymbol: "UUSD",
        tokenDecimals: 12,
        cashDecimals: 18,
      },
      {
        dexAddress: "KT1JeWiS8j1kic4PHx7aTnEr9p4xVtJNzk5b",
        tokenSymbol: "UUSD",
        cashSymbol: "WUSDC",
        tokenDecimals: 12,
        cashDecimals: 6,
      },
      {
        dexAddress: "KT1T974a8qau4xP3RAAWPYCZM9xtwU9FLjPS",
        cashSymbol: "tzBTC",
        tokenSymbol: "wwBTC",
        tokenDecimals: 8,
        cashDecimals: 8,
      },
      {
        dexAddress: "KT1Xbx9pykNd38zag4yZvnmdSNBknmCETvQV",
        tokenSymbol: "UUSD",
        cashSymbol: "USDTz",
        tokenDecimals: 12,
        cashDecimals: 6,
      },
      {
        dexAddress: "KT1XvH5f2ja2jzdDbv6rxPmecZFU7s3obquN",
        cashSymbol: "tzBTC",
        tokenSymbol: "UBTC",
        cashDecimals: 8,
        tokenDecimals: 12,
      },
    ];
    const toRet = [];

    for (var i = 0; i < youvesDexes.length; i++) {
      const resp = await getContractStorage(youvesDexes[i].dexAddress);
      toRet.push({ ...resp.data, ...youvesDexes[i] });
    }
    return toRet;
  },
};
