import axios from "axios";
import BigNumber from "bignumber.js";
import _ from "lodash";
import utils from ".";
import dexIndexer from "./dex-indexer";
import tzkt from "./tzkt";

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
  async getTokenPriceXTZ(tokenId) {
    const query = `
    query MyQuery {
        quotesTotal(distinct_on: tokenId, where: {tokenId: {_eq: "${tokenId}"}}) {
          close
        }
      }
      
    `;

    const {
      data: {
        data: { quotesTotal },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", { query });

    return Number(quotesTotal[0]?.close) || 0;
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
        exchanges{
          address
          name
          tokenId
          tezPool
          tokenPool
          tradeVolume
          midPrice
          sharesTotal
        }
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

    const updatedAllTokens = {};
    allTokens?.forEach((value) => {
      updatedAllTokens[`${value.token_address}_${value.token_id || 0}`] = value;
    });

    // console.log("\n\n------ begin:  ------");
    // console.log(updatedAllTokens);
    // console.log("------ end:  ------\n\n");x

    for (let index = 0; index < token.length; index++) {
      const element = token[index];
      const tokenMetadata = _.mapKeys(
        updatedAllTokens[element.id],
        _.rearg(_.camelCase, 1)
      );
      element.thumbnailUri =
        tokenMetadata?.thumbnailUri ||
        element?.thumbnailUri ||
        "https://static.thenounproject.com/png/796573-200.png";

      const tokenVal = quotesTotal.find((val) => val.tokenId === element.id);

      tokenObjkt[element.id] = utils.mergeObjects(element, {
        ...tokenMetadata,
        currentPrice: new BigNumber(tokenVal?.close).toNumber() || 0,
      });
    }

    return tokenObjkt;
  },

  async getTokensPriceClose() {
    const date = new Date();

    const day1 = new Date(date.setDate(date.getDate() - 1)).toDateString();
    const day7 = new Date(date.setDate(date.getDate() - 7)).toDateString();
    const day30 = new Date(date.setDate(date.getDate() - 30)).toDateString();

    let day1UsdPrice = 0;
    let day7UsdPrice = 0;
    let day30UsdPrice = 0;

    const query = (bucket) => `
    query MyQuery {
      quotes1dNogaps(where: {bucket: {_eq: "${bucket}"}}
      order_by: {bucket: desc}
      ) {
        average
        close
        bucket
        tokenId
      }
    }
    `;

    const [
      xtzUsdHistory,
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
      tzkt.getXtzUsdHistory({
        limit: "60",
        sort: "desc",
      }),
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query: query(day1),
      }),
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query: query(day7),
      }),
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query: query(day30),
      }),
    ]);

    for (let index = 0; index < xtzUsdHistory.length; index++) {
      const value = xtzUsdHistory[index];

      if (new Date(value[0]).toDateString() === day1) {
        day1UsdPrice = value[1].usd;
      }

      if (new Date(value[0]).toDateString() === day7) {
        day7UsdPrice = value[1].usd;
      }
      if (new Date(value[0]).toDateString() === day30) {
        day30UsdPrice = value[1].usd;
      }
    }

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
        dayClose[token.tokenId] = {
          ...token,
          closeUsd: Number(token.close) * day1UsdPrice,
        };
      }
      if (weekCloseArray.length > index) {
        const token = weekCloseArray[index];
        weekClose[token.tokenId] = {
          ...token,
          closeUsd: Number(token.close) * day7UsdPrice,
        };
      }
      if (monthCloseArray.length > index) {
        const token = monthCloseArray[index];
        monthClose[token.tokenId] = {
          ...token,
          closeUsd: Number(token.close) * day30UsdPrice,
        };
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
      dayCloseUsd: closeObjkt.dayClose[tokenId]?.closeUsd || 0,
      weekCloseUsd: closeObjkt.weekClose[tokenId]?.closeUsd || 0,
      monthCloseUsd: closeObjkt.monthClose[tokenId]?.closeUsd || 0,
    };
  },

  formatToTeztoolStruct(tokenObjkt) {
    for (let index = 0; index < tokenObjkt?.exchanges.length; index++) {
      const exchange = tokenObjkt?.exchanges[index];
      exchange.dex = exchange.name;
    }
  },
};
