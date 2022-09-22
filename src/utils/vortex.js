// import axios from "axios";
const axios = require("axios");
module.exports = {
  async getTradingPools() {
    const query = `
        query all_pools {
          data: pair {
            pool_address: id
            token0 {
              address
              decimals
              tokenId
              icon
              name
              symbol
              contractFormat
            }
            token1 {
              address
              decimals
              tokenId
              icon
              name
              symbol
              contractFormat
            }
            token1_pool: reserve1
            token0_pool: reserve0
            liquidity {
              lqt_total_supply: totalSupply
            }
            lqt_address : liquidityId
          }
        }`;

    return Promise.all([
      axios.post("https://api.vortex.network/v1/graphql", { query }),
      axios.post("https://api-dev.vortex.network/v1/graphql", { query }),
    ]).then((res) => {
      return [...res[0].data.data.data, ...res[1].data.data.data];
    });
  },
};
