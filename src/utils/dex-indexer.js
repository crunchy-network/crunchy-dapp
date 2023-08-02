import axios from "axios";

const makeQuery = async (query) => {
  return axios.post("https://dex-indexer.crunchy.network/v1/graphql", {
    query,
  });
};

const QUERY_GET_LP_TOKENS = `query LPTokens {
  tokens(where: {is_lp: {_eq: true}}) {
    decimals
    name
    symbol
    thumbnail_uri
    token_address
    token_id
    total_supply
    token_type
    is_lp
  }
}`;

const QUERY_GET_ALL_TOKEN_POOLS = `query TokenPools {
  token_pools(limit: 1000000) {
    token_address
    token {
      symbol
      name
      thumbnail_uri
    }
    token_id
    reserves
    lp_token_address
    lp_token_id
    params {
      name
      value
    }
  }
}`;

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
    is_lp
    pools(where: {quotes_spot: {quote_token_address: {_eq: "tez"}}}, limit: 1) {
      quotes_spot {
        quote
      }
    }
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
  async getLPTokens() {
    return makeQuery(QUERY_GET_LP_TOKENS).then((res) =>
      res.data && res.data.data && res.data.data.tokens
        ? res.data.data.tokens
        : []
    );
  },
  async getTokenPools() {
    return makeQuery(QUERY_GET_ALL_TOKEN_POOLS).then((res) =>
      res.data && res.data.data && res.data.data.token_pools
        ? res.data.data.token_pools
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
};
