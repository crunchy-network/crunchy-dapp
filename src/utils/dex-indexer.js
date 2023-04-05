import axios from "axios";

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
};
