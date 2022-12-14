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

export default {
  async getAllTokens() {
    return makeQuery(QUERY_GET_ALL_TOKENS).then((res) =>
      res.data && res.data.data && res.data.data.tokens
        ? res.data.data.tokens
        : []
    );
  },

  async getAllDexes() {
    return makeQuery(QUERY_GET_ALL_DEXES).then((res) =>
      res.data && res.data.data && res.data.data.dexs ? res.data.data.dexs : []
    );
  },
};
