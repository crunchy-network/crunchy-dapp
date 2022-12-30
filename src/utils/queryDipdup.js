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

  async getTokensPriceClose() {
    const date = new Date();

    const previousDay = new Date(
      date.setDate(date.getDate() - 1)
    ).toDateString();

    const previousWeek = new Date(
      date.setDate(date.getDate() - ((date.getDay() + 6) % 7))
    ).toDateString();

    const previousMonth = new Date(
      new Date(date.setDate(1)).setMonth(date.getMonth() - 1)
    ).toDateString();

    const query = (bucket) => `
    query MyQuery {
      quotes1dNogaps(where: {bucket: {_eq: "${bucket}"}}) {
        average
        close
        bucket
        tokenId
      }
    }
    `;

    const [
      {
        data: {
          data: { quotes1dNogaps: dayCloseArray },
        },
      },
      {
        data: {
          data: { quotes1dNogaps: weekCloseArray },
        },
      },
      {
        data: {
          data: { quotes1dNogaps: monthCloseArray },
        },
      },
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query: query(previousDay),
      }),
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query: query(previousWeek),
      }),
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query: query(previousMonth),
      }),
    ]);

    const dayClose = {};
    const weekClose = {};
    const monthClose = {};

    const length = Math.max(
      dayCloseArray.length,
      weekCloseArray.length,
      monthCloseArray.length
    );

    for (let index = 0; index < length; index++) {
      if (dayCloseArray.length > index) {
        const token = dayCloseArray[index];
        dayClose[token.tokenId] = dayClose[token.tokenId]
          ? { ...dayClose[token.tokenId], close: token.average }
          : token;
      }
      if (weekCloseArray.length > index) {
        const token = weekCloseArray[index];
        weekClose[token.tokenId] = weekClose[token.tokenId]
          ? { ...weekClose[token.tokenId], close: token.average }
          : token;
      }
      if (monthCloseArray.length > index) {
        const token = monthCloseArray[index];
        monthClose[token.tokenId] = monthClose[token.tokenId]
          ? { ...dayClose[token.tokenId], close: token.average }
          : token;
      }
    }
    return {
      dayClose,
      weekClose,
      monthClose,
    };
  },

  filterTokenClose(tokenId, closeObjkt) {
    return {
      dayClose: closeObjkt.dayClose[tokenId]?.close || 0,
      weekClose: closeObjkt.weekClose[tokenId]?.close || 0,
      monthClose: closeObjkt.monthClose[tokenId]?.close || 0,
    };
  },
};
