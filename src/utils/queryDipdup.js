import axios from "axios";

export default {
  async getTokenPriceAndData(tokenId) {
    const query = `
        query MyQuery {
            token(distinct_on: id, where: {id: {_eq: "${tokenId}"}}) {
              id
              decimals
              address
              name
              standard
              symbol
              tokenId
              thumbnailUri
            }
            quotesTotal(distinct_on: tokenId, where: {tokenId: {_eq: "${tokenId}"}}) {
              close
            }
          }
          
        `;

    const {
      data: {
        data: { token, quotesTotal },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", { query });

    if (token.length > 0 && quotesTotal.length > 0) {
      return {
        ...token[0],
        currentPrice: Number(quotesTotal[0]?.close),
      };
    } else return {};
  },
};
