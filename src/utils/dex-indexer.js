import axios from "axios";

const makeQuery = async (query) => {
  return axios.post("https://dex-indexer.crunchy.network/v1/graphql", {
    query,
  });
};

const QUERY_GET_ALL_TOKENS = `query AllTokens {
  tokens(where: {is_lp: {_eq: false}}) {
    decimals
    name
    symbol
    thumbnail_uri
    token_address
    token_id
    total_supply
    token_type
    pools(
      where: {_or: [{quotes_spot: {quote_token_address: {_eq: "KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn"}}}, {quotes_spot: {quote_token_address: {_eq: "tez"}}}]}
      limit: 1
    ) {
      quotes_spot {
        quote
        quote_token_address
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
    pools(
      where: {_or: [{quotes_spot: {quote_token_address: {_eq: "KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn"}}}, {quotes_spot: {quote_token_address: {_eq: "tez"}}}]}
      limit: 1
    ) {
      quotes_spot {
        quote
        quote_token_address
      }
    }
  }
}
`;

const QUERY_GET_ALL_TOKENS_FEED = `query AllTokens {
  tokens(where: {is_lp: {_eq: false}}) {
    decimals
    name
    symbol
    thumbnail_uri
    token_address
    token_id
    total_supply
    token_type
    pools(
      where: {_or: [{quotes_spot: {quote_token_address: {_eq: "KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn"}}}, {quotes_spot: {quote_token_address: {_eq: "tez"}}}], quotes_spot: {quote: {_neq: "NaN"}}}
      limit: 1
    ) {
      dex_address
      pool_id
      reserves
      token_address
      token_id
      dex {
        dex_type
      }
      quotes_spot {
        quote
        quote_token_address
      }
      quotes_1d {
        open
        close
        volume_quote
        quote_token_address
      }
      quotes_1w {
        open
        close
        volume_quote
        quote_token_address
      }
      quotes_1mo {
        open
        close
        volume_quote
        quote_token_address
      }
    }
  }
}
`;

const QUERY_GET_ALL_TOKENS_POOLS = `query AllTokens {
  tokens(where: {is_lp: {_eq: false}}) {
    token_address
    token_id
    pools {
      dex_address
      pool_id
      reserves
      token_address
      token_id
      token {
        decimals
      }
      dex {
        dex_type
        pools {
          token_id
          token_address
          token {
            symbol
            decimals
          }
          reserves
          pool_id
        }
      }
      quotes_spot{
        quote
      }
      quotes_1d {
        close
        volume_quote
        volume_base
        token_id
        token_address
        quote_token_id
        quote_token_address
      }
      quotes_1w {
        close
        volume_quote
      }
      quotes_1mo {
        close
        volume_quote
      }
    }
  }
}
`;
const QUERY_GET_QUOTES_1D = (tokenAddress, tokenId) =>
  `
query AllTokens {
  quotes_1d(
    where: {token_address: {_eq: "${tokenAddress}"}, token_id: {_eq: ${Number(
    tokenId
  )}}}
  order_by: {bucket: asc}
  ) {
    dex {
      dex_type
    }
    bucket
    close
    token_address
    token_id
    volume_quote 
    quote_token_address
    quote_token_id
    quote_token {
      pools(where: {quotes_spot: {quote_token_address: {_eq: "tez"}}}, limit: 1) {
        quotes_spot {
          quote
        }
      }
    }     
  }
}
`;
const QUERY_GET_QUOTES_1H = (tokenAddress, tokenId, oneMonthAgo) =>
  `
query AllTokens {
  quotes_1h(
    where: {token_address: {_eq: "${tokenAddress}"}, token_id: {_eq: "${tokenId}"}, bucket: {_gt: "${oneMonthAgo}"}}
    order_by: {bucket: asc} 
  ) {
    dex {
      dex_type
    }
    bucket
    close
    token_address
    token_id
    volume_quote  
    quote_token_address
    quote_token_id
    quote_token {
      pools(where: {quotes_spot: {quote_token_address: {_eq: "tez"}}}, limit: 1) {
        quotes_spot {
          quote
        }
      }
    }  
  }
}
`;
const QUERY_GET_QUOTES_1W = (tokenAddress, tokenId) =>
  `
query AllTokens {
  quotes_1w(
    where: {token_address: {_eq: "${tokenAddress}"}, token_id: {_eq: ${Number(
    tokenId
  )}}}
  order_by: {bucket: asc}
  ) {
    dex {
      dex_type
    }
    bucket
    close
    token_address
    token_id
    volume_quote 
    quote_token_address
    quote_token_id
    quote_token {
      pools(where: {quotes_spot: {quote_token_address: {_eq: "tez"}}}, limit: 1) {
        quotes_spot {
          quote
        }
      }
    }     
  }
}
`;
const QUERY_GET_QUOTES_1MO = (tokenAddress, tokenId) =>
  `
query AllTokens {
  quotes_1mo(
    where: {token_address: {_eq: "${tokenAddress}"}, token_id: {_eq: ${Number(
    tokenId
  )}}}
  order_by: {bucket: asc}
  ) {
    dex {
      dex_type
    }
    bucket
    close
    token_address
    token_id
    volume_quote    
    quote_token_address
    quote_token_id
    quote_token {
      pools(where: {quotes_spot: {quote_token_address: {_eq: "tez"}}}, limit: 1) {
        quotes_spot {
          quote
        }
      }
    }  
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

  async getAllTokenSpot() {
    return makeQuery(QUERY_GET_ALL_TOKENS_FEED).then((res) =>
      res.data && res.data.data && res.data.data.tokens
        ? res.data.data.tokens
        : []
    );
  },

  async getAllTokenPools() {
    return makeQuery(QUERY_GET_ALL_TOKENS_POOLS).then((res) =>
      res.data && res.data.data && res.data.data.tokens
        ? res.data.data.tokens
        : []
    );
  },

  async getQuotes1D(tokenAddress, tokenId) {
    return makeQuery(QUERY_GET_QUOTES_1D(tokenAddress, tokenId)).then((res) =>
      res.data && res.data.data && res.data.data.quotes_1d
        ? res.data.data.quotes_1d
        : []
    );
  },

  async getQuotes1H(tokenAddress, tokenId, oneMonthAgo) {
    return makeQuery(
      QUERY_GET_QUOTES_1H(tokenAddress, tokenId, oneMonthAgo)
    ).then((res) =>
      res.data && res.data.data && res.data.data.quotes_1h
        ? res.data.data.quotes_1h
        : []
    );
  },

  async getQuotes1W(tokenAddress, tokenId) {
    return makeQuery(QUERY_GET_QUOTES_1W(tokenAddress, tokenId)).then((res) =>
      res.data && res.data.data && res.data.data.quotes_1w
        ? res.data.data.quotes_1w
        : []
    );
  },

  async getQuotes1MO(tokenAddress, tokenId) {
    return makeQuery(QUERY_GET_QUOTES_1MO(tokenAddress, tokenId)).then((res) =>
      res.data && res.data.data && res.data.data.quotes_1mo
        ? res.data.data.quotes_1mo
        : []
    );
  },
};
