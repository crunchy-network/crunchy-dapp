import axios from "axios";
import dexIndexer from "./dex-indexer";

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
  async getAllTokenAndQuotes() {
    const tokenObjkt = {};
    const query = `
    query MyQuery {
      quotesTotal(distinct_on: tokenId){
        close
        tokenId
      }
      token {
        address
        decimals
        id
        name
        standard
        symbol
        thumbnailUri
        tokenId
      }
    }
    `;

    const [
      {
        data: {
          data: { quotesTotal, token },
        },
      },
      allTokens,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", { query }),
      dexIndexer.getAllTokens(),
    ]);

    for (let index = 0; index < token.length; index++) {
      const element = token[index];
      if (index + 1 < allTokens.length) {
        element.thumbnailUri = allTokens[index].thumbnail_uri;
      }

      element.thumbnailUri = element.thumbnailUri || "";
      const tokenVal = quotesTotal.find((val) => val.tokenId === element.id);

      tokenObjkt[element.id] = {
        ...element,
        currentPrice: Number(tokenVal?.close),
      };
    }

    return tokenObjkt;
  },
};
