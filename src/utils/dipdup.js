const axios = require("axios");

module.exports = {
  async getDipdupData() {
    const query = `query MyQuery {
            exchange(limit: 10000) {
              address
              name
              standard
              tezPool
              tokenId
              tokenPool
              token {
                address
                id
                name
                symbol
                standard
                thumbnailUri
                tokenId
                decimals
              }
              sharePx
              sharePxBtc
              sharePxUsd
              sharesTotal
              midPrice
            }
          }`;
    const res = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
    });
    if (res.status === 200) {
      return res.data.data.exchange;
    }
    console.error(`Dipdup responded with a ${res.status} status`);
    console.log(res);
    return [];
  },
};
