import axios from "axios";
import farmUtils from "./farm";

const makeQuery = async (query) => {
  return axios.post("https://dex-indexer.crunchy.network/v1/graphql", {
    query,
  });
};

const QUERY_GET_ALL_TOKENS = `query AllTokens {
  tokens {
    decimals
    name
    symbol
    thumbnail_uri
    token_address
    token_id
    total_supply
    token_type
  }
}`;

const QUERY_GET_ALL_DEXES = `query AllDexes {
  dexs {
    dex_address
    dex_type
    params {
      name
      value
    }
    pools {
      pool_id
      reserves
      params {
        name
        value
      }
      token_address
      token_id
      token {
        decimals
        symbol
        token_type
      }
    }
  }
}`;

const QUERY_GET_ALL_TOKEN_POOLS = `query AllTokenPools {
  tokens {
    decimals
    name
    symbol
    thumbnail_uri
    token_address
    token_id
    token_type
    total_supply
    pools(where: {dex: {dex_type: {_eq: "quipuswap"}}}) {
      dex {
        dex_address
        dex_type
        params {
          value
          name
        }
        pools {
          reserves
          token_address
          token {
            decimals
          }
        }
      }
    }
  }
}`;

const QUERY_GET_A_TOKEN = (tokenAddress, tokenId) => `
query MyQuery {
  tokens(where: {token_address: {_eq: "${tokenAddress}"}, token_id: {_eq: ${Number(
  tokenId
)}}}){
    decimals
    name
    symbol
    thumbnail_uri
    token_type
    total_supply
    token_address
    token_id
  }
}
`;
export default {
  async getAllTokens() {
    return makeQuery(QUERY_GET_ALL_TOKENS).then((res) =>
      res.data && res.data.data && res.data.data.tokens
        ? res.data.data.tokens
        : []
    );
  },
  async getToken(tokenAddress, tokenId) {
    return makeQuery(QUERY_GET_A_TOKEN(tokenAddress, tokenId)).then((res) =>
      res.data && res.data.data && res.data.data.tokens
        ? res.data.data.tokens[0]
        : {}
    );
  },

  async getAllDexes() {
    return makeQuery(QUERY_GET_ALL_DEXES).then((res) =>
      res.data && res.data.data && res.data.data.dexs ? res.data.data.dexs : []
    );
  },

  async getAllTokenPools() {
    return makeQuery(QUERY_GET_ALL_TOKEN_POOLS).then((res) =>
      res.data && res.data.data && res.data.data.tokens
        ? res.data.data.tokens
        : []
    );
  },
  findTokenInPriceFeed(token, feed) {
    if (farmUtils.isFa1(token)) {
      return feed.find((el) => {
        return (
          el.token_address === token.address || el.address === token.address
        );
      });
    } else {
      return feed.find((el) => {
        return (
          (el.token_address === token.address &&
            el.token_id === parseInt(token.tokenId)) ||
          el.address === token.address
        );
      });
    }
  },
};
