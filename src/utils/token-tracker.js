import axios from "axios";
import BigNumber from "bignumber.js";
import ipfs from "./ipfs";
import queryDipdup from "./queryDipdup";

const twentyFourHrs = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const fourtyEightHrs = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

async function queryXtzVolume() {
  const query = `
  query MyQuery {
    trade(where: { timestamp: {_gte: "${twentyFourHrs}"}}) {
      tezQty
      timestamp
      tokenId
      exchangeId
    }
  }`;

  const {
    data: {
      data: { trade },
    },
  } = await axios.post("https://dex.dipdup.net/v1/graphql", {
    query,
  });

  return trade;
}

export default {
  async getQuotes() {
    const query = `
    query MyQuery {
      quotesTotal(distinct_on: tokenId) {
        high
        low
        tokenId
      }
     
      statsTotal(distinct_on: tokenId) {
        tokenId
        tvlUsd
      }
    }
    `;
    const {
      data: {
        data: { quotesTotal, statsTotal },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", { query });

    return { quotesTotal, totalTvl: statsTotal };
  },
  async getDayBeforeVolume() {
    const query = `
    query MyQuery {
      quotes1dNogaps(
        where: {bucket: {_gte: "${fourtyEightHrs}",  _lt: "${twentyFourHrs}"}}
        distinct_on: tokenId
      ) {
        volume
        tokenId
      }
    }
    `;

    const {
      data: {
        data: { quotes1dNogaps },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", { query });

    return quotes1dNogaps;
  },

  async getPriceAndVolumeQuotes(tokenId) {
    const query = `
    query MyQuery($tokenId: String) {
      quotes1dNogaps (
        where: {tokenId: {_eq: $tokenId}}
        distinct_on: bucket
        order_by: {bucket: asc}
      ) {
        bucket
        close
        volume
        xtzVolume
        tokenId
      }
      quotes1wNogaps(
        where: {tokenId: {_eq: $tokenId}}
        distinct_on: bucket
        order_by: {bucket: asc}
      ) {
        bucket
        close
        tokenId
        xtzVolume
        volume
      }
      quotes1mo(
        distinct_on: bucket
        order_by: {bucket: asc}
        where: {tokenId: {_eq: $tokenId}}
      ) {
        close
        volume
        tokenId
        xtzVolume
        bucket
      }
      }
    `;
    const {
      data: {
        data: { quotes1dNogaps, quotes1wNogaps, quotes1mo },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId },
    });

    return { quotes1d: quotes1dNogaps, quotes1w: quotes1wNogaps, quotes1mo };
  },

  async getQuotes1dNogaps(tokenId, startTime) {
    const query = `
    query MyQuery($tokenId: String, $startTime: timestamptz) {
      quotes1dNogaps(
        order_by: {bucket: asc}
        where: {tokenId: {_eq: $tokenId},
                bucket: {_gt: $startTime}}
        distinct_on: bucket
      ) {
          bucket
          volume
          xtzVolume
          close
        }
      }
    `;
    const {
      data: {
        data: { quotes1dNogaps },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId, startTime: startTime },
    });
    return quotes1dNogaps;
  },

  async getAllQuotes1d(tokenId) {
    const query = `
    query MyQuery($tokenId: String) {
      quotes1dNogaps(
        order_by: {bucket: asc}
        where: {tokenId: {_eq: $tokenId}}
        distinct_on: bucket
      ) {
          bucket
          volume
          xtzVolume
          close
        }
      }
    `;
    const {
      data: {
        data: { quotes1dNogaps },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId },
    });
    return quotes1dNogaps;
  },

  async getActivity(tokenId, startTime) {
    const query = `
    query MyQuery($tokenId: String, $startTime: timestamptz) {
      activity(
        order_by: {timestamp: asc}
        where: {tokenId: {_eq: $tokenId},
                timestamp: {_gt: $startTime}}
        distinct_on: timestamp
        limit: 300
      ) {
          tvl
          tvlUsd
          timestamp
        }
      }
    `;
    const {
      data: {
        data: { activity },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId, startTime: startTime },
    });
    return activity;
  },

  async getAllActivity(tokenId) {
    const query = `
    query MyQuery($tokenId: String) {
      activity(
        order_by: {timestamp: asc}
        where: {tokenId: {_eq: $tokenId},}
        distinct_on: timestamp
        limit: 300
      ) {
          tvl
          tvlUsd
          timestamp
        }
      }
    `;
    const {
      data: {
        data: { activity },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId },
    });
    return activity;
  },

  async getChartTvl(tokenId, exchangeId) {
    const query = `
    query MyQuery($tokenId: String) {
      stats1d(
        where: {exchangeId: {_eq: "${exchangeId}"}}
        distinct_on: bucket
      ) {
        bucket
        tvlUsd
        tvl
        exchangeId
      }
      stats1mo(where: {tokenId: {_eq: $tokenId }}, distinct_on: bucket) {
        bucket
        tvlUsd
        tvl
        tokenId
      }
      stats1w(distinct_on: bucket, where: {tokenId: {_eq: $tokenId }}) {
        bucket
        tokenId
        tvlUsd
        tvl
      }
    }
    `;

    const {
      data: {
        data: { stats1mo, stats1w, stats1d },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId },
    });

    return {
      tvl1Day: stats1d,
      tvl30Day: stats1mo,
      tvl7Day: stats1w,
      tvlAll: stats1d,
    };
  },

  async getTokenFeed() {
    const query = `
     query MyQuery {
      quotesTotal(distinct_on: tokenId){
        close
        tokenId
      }
      statsTotal {
        tvlUsd
        tvl
        exchangeId
        tokenId
      }
      token {
        exchanges{
          address
          name
          tokenId
          tezPool
          tokenPool
          tradeVolume
          midPrice
        }
        address
        decimals
        id
        name
        symbol
        thumbnailUri
        tokenId
      }
    }`;

    const [
      {
        data: {
          data: { quotesTotal, statsTotal, token },
        },
      },
      tokensCloseData,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query,
      }),
      queryDipdup.getTokensPriceClose(),
    ]);

    const tokensVolume = await queryXtzVolume();

    const tokenObjkt = {};

    for (let index = 0; index < token.length; index++) {
      const element = token[index];
      const tokenId = element.id;
      const closes = queryDipdup.filterTokenClose(tokenId, tokensCloseData);

      const tokenQuotesTotal = quotesTotal.find(
        (quote) => quote.tokenId === tokenId
      );

      let volume24Xtz = 0;

      tokensVolume.forEach((o) => {
        if (o.tokenId === tokenId) {
          volume24Xtz = new BigNumber(o.tezQty).plus(volume24Xtz).toNumber();
          element.exchanges.forEach((e, index) => {
            if (e.address === o.exchangeId) {
              element.exchanges[index].volume24 = new BigNumber(
                element.exchanges[index].volume24 || 0
              )
                .plus(o.tezQty)
                .toNumber();
            }
          });
        }
      });
      const tokenTvlUsd =
        new BigNumber(
          statsTotal.find((quote) => quote.tokenId === tokenId)?.tvlUsd
        ).toNumber() || 0;

      const tokenTvl =
        new BigNumber(
          statsTotal.find((quote) => quote.tokenId === tokenId)?.tvl
        ).toNumber() || 0;

      tokenObjkt[element.id] = {
        ...element,
        ...closes,
        currentPrice: Number(tokenQuotesTotal?.close),
        // allTimeLow: tokenQuotesTotal?.low || 0,
        tokenTvl,
        tokenTvlUsd,
        volume24Xtz,
      };
    }

    return tokenObjkt;
  },

  async calcHolders(token) {
    const [address, tokenId] = token.id?.split("_");

    const uri = `https://api.tzkt.io/v1/tokens?select=contract,tokenId,holdersCount&limit=10000&contract=${address}&tokenId=${tokenId}`;
    await axios.get(uri).then((res) => {
      token.holders = res.data[0] ? res.data[0].holdersCount : 0;
    });

    return token;
  },

  async calculateTokenData(token, tokenFeed, allTokensMetadata, xtzUsd) {
    const tokenPrice = tokenFeed[token.id];

    // tokenPrice.currentPrice = currentPrice;

    const tokenMetadata = allTokensMetadata.find((el) => {
      return (
        el.token_address === token.tokenAddress &&
        (el.token_id !== undefined
          ? el.token_id === (token.tokenId || 0)
          : true)
      );
    });

    const element = tokenPrice;

    if (element && tokenMetadata) {
      element.thumbnailUri = ipfs.transformUri(
        tokenMetadata.thumbnail_uri ||
          "https://static.thenounproject.com/png/796573-200.png"
      );

      const currentPrice =
        new BigNumber(element?.currentPrice).toNumber() || false;
      element.currentPrice = currentPrice;

      const price = new BigNumber(currentPrice);
      const priceUsd = price.times(xtzUsd);
      element.usdValue = price.times(xtzUsd).toNumber();

      element.calcSupply = new BigNumber(tokenMetadata.total_supply)
        .div(new BigNumber(10).pow(tokenMetadata.decimals))
        .toNumber();

      element.mktCap = new BigNumber(element.calcSupply)
        .times(element.currentPrice)
        .toNumber();
      element.mktCapUsd = new BigNumber(element.calcSupply)
        .times(element.usdValue)
        .toNumber();

      const change1Day = price
        .minus(element?.dayClose)
        .div(element?.dayClose)
        .times(100)
        .toNumber();
      const change7Day = price
        .minus(element?.weekClose)
        .div(element?.weekClose)
        .times(100)
        .toNumber();
      const change30Day = price
        .minus(element?.monthClose)
        .div(element?.monthClose)
        .times(100)
        .toNumber();

      element.change1Day = change1Day === Infinity ? 0 : change1Day || 0;
      element.change7Day = change7Day === Infinity ? 0 : change7Day || 0;
      element.change30Day = change30Day === Infinity ? 0 : change30Day || 0;

      /**
       *Calculating % changes in Usd
       */

      const change1DayUsd = priceUsd
        .minus(element?.dayCloseUsd)
        .div(element?.dayCloseUsd)
        .times(100)
        .toNumber();
      const change7DayUsd = priceUsd
        .minus(element?.weekCloseUsd)
        .div(element?.weekCloseUsd)
        .times(100)
        .toNumber();
      const change30DayUsd = priceUsd
        .minus(element?.monthCloseUsd)
        .div(element?.monthCloseUsd)
        .times(100)
        .toNumber();

      element.change1DayUsd =
        change1DayUsd === Infinity ? 0 : change1DayUsd || 0;
      element.change7DayUsd =
        change7DayUsd === Infinity ? 0 : change7DayUsd || 0;
      element.change30DayUsd =
        change30DayUsd === Infinity ? 0 : change30DayUsd || 0;

      element.volume24 = new BigNumber(element.volume24Xtz).toNumber();
      element.volume24Usd = new BigNumber(element.volume24Xtz)
        .times(xtzUsd)
        .toNumber();

      for (let index = 0; index < element?.exchanges.length; index++) {
        const market = element?.exchanges[index];

        element.exchanges[index].lpPriceUsd =
          Number(market.midPrice) * xtzUsd || 0;

        element.exchanges[index].lpPrice =
          Number(market.midPrice) * xtzUsd || 0;

        element.exchanges[index].symbol = `XTZ/${element.symbol}`;
        element.exchanges[index].volume24Usd = new BigNumber(market.volume24)
          .times(xtzUsd)
          .toNumber();
      }

      if (element.mktCap < 800000000 && element.mktCap > 0) return element;
    }
  },

  binarySearch(arr, target) {
    const d = new Date(target);
    // Find the middle element of the array
    const mid = Math.floor(arr.length / 2);

    // If the target is less than the middle element, search the left half of the array
    if (d < new Date(arr[mid][0])) {
      // If the left half of the array is empty, return the index of the middle element
      if (mid === 0) {
        return arr[mid][1]?.usd;
      } else {
        return this.binarySearch(arr.slice(0, mid), d);
      }
    }
    // If the target is greater than the middle element, search the right half of the array
    else if (d > new Date(arr[mid][0])) {
      // If the right half of the array is empty, return the index of the middle element
      if (mid === arr.length - 1) {
        return arr[mid][1]?.usd;
      } else {
        return this.binarySearch(arr.slice(mid + 1), d);
      }
    }
    // If the target is equal to the middle element, return the index of the middle element
    else {
      return arr[mid][1]?.usd;
    }
  },
};
