import axios from "axios";
import BigNumber from "bignumber.js";
import ipfs from "./ipfs";
import queryDipdup from "./queryDipdup";

const twentyFourHrs = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const fourtyEightHrs = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
const PLY_SYMBOL = "PLY";
const PLY_TOKEN_ID = "KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX_0";
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

async function getPlentyPools() {
  const uri = `https://api.analytics.plenty.network/analytics/pools`;
  const res = await (await axios.get(uri)).data;

  return res;
}

async function getPlentyTokens(symbol = "") {
  const uri = `https://api.analytics.plenty.network/analytics/tokens/${symbol}?priceHistory=day`;
  const res = await (await axios.get(uri)).data;

  return res;
}

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function aggregate(num1, num2, index1, index2) {
  return (num1 * index1 + num2 * index2) / (index1 + index2);
}

function findElementWithSameDate(array, targetDate) {
  return array.find((element) => {
    const dateString = Object.keys(element)[0];
    const date = Number(dateString) * 1000;
    return sameDay(new Date(date), new Date(targetDate));
  });
}

function getAggregatedPriceAndVolume(quotesNogaps, token, xtzUSD) {
  const aggregatedQuotesNoGaps = quotesNogaps.map((quote) => {
    const price = findElementWithSameDate(token[0].price.history, quote.bucket);
    const volume = findElementWithSameDate(
      token[0].volume.history,
      quote.bucket
    );
    quote.plentyClose = price ? Object.values(price)[0].c : 0;
    quote.plentyXTZVolume = volume ? Object.values(volume)[0] / xtzUSD : 0;
    quote.aggregatedClose = aggregate(
      Number(quote.plentyClose),
      Number(quote.close),
      Number(quote.plentyXTZVolume),
      Number(quote.xtzVolume)
    );
    quote.aggregatedXtzVolume =
      Number(quote.plentyXTZVolume) + Number(quote.xtzVolume);
    return quote;
  });
  return aggregatedQuotesNoGaps;
}

function getAggregatedTvl(stats, token, xtzUSD) {
  const aggregatedStats = stats.map((stat) => {
    const tvl = findElementWithSameDate(token[0].tvl.history, stat.bucket);

    stat.plentyTvlUsd = tvl ? Object.values(tvl)[0] : 0;
    stat.plentyTvl = tvl ? Object.values(tvl)[0] / xtzUSD : 0;
    stat.aggregatedTvlUsd = Number(stat.plentyTvlUsd) + Number(stat.tvlUsd);
    stat.aggregatedTvl = Number(stat.plentyTvl) + Number(stat.tvl);
    return stat;
  });
  return aggregatedStats;
}

function getPlentyTokenPriceAndVolume(plentyToken, timeInterval) {
  const aggregatedVolume1D = plentyToken[0].volume.history.map((element) => {
    const dateString = Object.keys(element)[0];
    const bucket = Number(dateString) * 1000;
    return {
      bucket: bucket,
      aggregatedXtzVolume: Object.values(element)[0],
    }
  })
  const aggregatedPriceAndVolume = aggregatedVolume1D.map((element) => {
    const price = findElementWithSameDate(
      plentyToken[0].price.history,
      element.bucket
    );
    element.aggregatedClose = price ? Object.values(price)[0].c : 0;
    return element;
  })
  console.log(aggregatedPriceAndVolume)
  return aggregatedPriceAndVolume;
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

  async getPriceAndVolumeQuotes(tokenId, symbol, xtzUSD) {
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
    const [
      {
        data: {
          data: { quotes1dNogaps, quotes1wNogaps, quotes1mo },
        },
      },
      token,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query,
        variables: { tokenId: tokenId },
      }),
      getPlentyTokens(symbol),
    ]);

    const aggregatedQuotes1dNoGaps = getAggregatedPriceAndVolume(
      quotes1dNogaps,
      token,
      xtzUSD
    );

    const aggregatedQuotes1wNoGaps = getAggregatedPriceAndVolume(
      quotes1wNogaps,
      token,
      xtzUSD
    );

    const aggregatedQuotes1moNoGaps = getAggregatedPriceAndVolume(
      quotes1mo,
      token,
      xtzUSD
    );

    return {
      quotes1d:
        tokenId === PLY_TOKEN_ID
          ? getPlentyTokenPriceAndVolume(token)
          : aggregatedQuotes1dNoGaps,
      quotes1w: aggregatedQuotes1wNoGaps,
      quotes1mo: aggregatedQuotes1moNoGaps,
    };
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

  async getAllQuotes1d(tokenId, symbol, xtzUSD) {
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
    const [
      {
        data: {
          data: { quotes1dNogaps },
        },
      },
      token,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query,
        variables: { tokenId: tokenId },
      }),
      getPlentyTokens(symbol),
    ]);

    const aggregatedQuotes1dNoGaps = getAggregatedPriceAndVolume(
      quotes1dNogaps,
      token,
      xtzUSD
    );
    if (tokenId === "KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX_0") {
      return getPlentyTokenPriceAndVolume(token)
    }
    return aggregatedQuotes1dNoGaps;
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

  async getChartTvl(tokenId, exchangeId, symbol, xtzUSD) {
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

    const [
      {
        data: {
          data: { stats1mo, stats1w, stats1d },
        },
      },
      token,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query,
        variables: { tokenId: tokenId },
      }),
      getPlentyTokens(symbol),
    ]);

    const aggregatedTvl1Day = getAggregatedTvl(stats1d, token, xtzUSD);
    const aggregatedTvl30Day = getAggregatedTvl(stats1mo, token, xtzUSD);
    const aggregatedTvl7Day = getAggregatedTvl(stats1w, token, xtzUSD);
    const aggregatedTvlAll = getAggregatedTvl(stats1d, token, xtzUSD);

    return {
      tvl1Day: aggregatedTvl1Day,
      tvl30Day: aggregatedTvl30Day,
      tvl7Day: aggregatedTvl7Day,
      tvlAll: aggregatedTvlAll,
    };
  },

  async getTokenFeed(xtzUSD) {
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
      plentyTokens,
      PLY,
      plentyPools,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query,
      }),
      queryDipdup.getTokensPriceClose(),
      getPlentyTokens(),
      getPlentyTokens(PLY_SYMBOL),
      getPlentyPools(),
    ]);

    quotesTotal.push({
      close: PLY[0].price.value,
      tokenId: `${PLY[0].contract}_0`,
    });
    const updatedPLY = PLY.map(function (obj) {
      return {
        exchanges: [],
        address: obj.contract,
        decimals: obj.decimals,
        id: `${obj.contract}_0`,
        name: obj.name,
        tokenId: 0,
        symbol: obj.token,
        thumbnailUri: "",
        change1Day: obj.price.change24H,
        change7Day: obj.price.change7D,
        change30Day: obj.price.change30D,
      };
    });

    token.push(updatedPLY[0]);

    const updatedPlentyPools = plentyPools.map(function (obj) {
      const baseSymbol = obj.symbol.split("/")[0];
      const quoteSymbol = obj.symbol.split("/")[1];
      const baseToken = plentyTokens.filter(
        (token) => token.token.toLowerCase() === baseSymbol.toLowerCase()
      );
      const quoteToken = plentyTokens.filter(
        (token) => token.token.toLowerCase() === quoteSymbol.toLowerCase()
      );
      const basePriceUsd = baseToken.length ? baseToken[0].price.value : null;
      const quotePriceUsd = quoteToken.length
        ? quoteToken[0].price.value
        : null;
      return {
        address: obj.pool,
        name: "plenty network",
        symbol: obj.symbol,
        volume24: obj.volume.value24H / xtzUSD,
        baseSymbol: baseSymbol,
        quoteSymbol: quoteSymbol,
        basePrice: basePriceUsd / xtzUSD,
        quotePrice: quotePriceUsd / xtzUSD,
        tokenTvl: obj.tvl.value / xtzUSD,
        tokenTvlUsd: obj.tvl.value,
      };
    });

    token.forEach((t) => {
      updatedPlentyPools.forEach(async (p) => {
        if (
          p.baseSymbol.toLowerCase() === t.symbol.toLowerCase() ||
          p.quoteSymbol.toLowerCase() === t.symbol.toLowerCase()
        ) {
          const exchange = {
            ...p,
            midPrice:
              p.baseSymbol.toLowerCase() === t.symbol.toLowerCase()
                ? p.basePrice
                : p.quotePrice,
          };
          t.exchanges.push(exchange);
        }
      });
    });

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
              element.exchanges[index].tokenTvl =
                new BigNumber(
                  statsTotal.find((quote) => quote.tokenId === tokenId)?.tvl
                ).toNumber() || 0;
              element.exchanges[index].tokenTvlUsd =
                new BigNumber(
                  statsTotal.find((quote) => quote.tokenId === tokenId)?.tvlUsd
                ).toNumber() || 0;
              element.exchanges[index].volume24 = new BigNumber(
                element.exchanges[index].volume24 || 0
              )
                .plus(o.tezQty)
                .toNumber();
            }
          });
        }
      });

      let tokenTvlUsd =
        new BigNumber(
          statsTotal.find((quote) => quote.tokenId === tokenId)?.tvlUsd
        ).toNumber() || 0;

      let tokenTvl =
        new BigNumber(
          statsTotal.find((quote) => quote.tokenId === tokenId)?.tvl
        ).toNumber() || 0;

      element.exchanges.forEach((e, index) => {
        if (e.name === "plenty network") {
          volume24Xtz = new BigNumber(volume24Xtz).plus(e.volume24).toNumber();
          tokenTvl = new BigNumber(tokenTvl).plus(e.tokenTvl).toNumber();
          tokenTvlUsd = new BigNumber(tokenTvlUsd)
            .plus(e.tokenTvl * xtzUSD)
            .toNumber();
        }
      });

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

      if (element.symbol !== PLY_SYMBOL) {
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
      }

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

        element.exchanges[index].lpPrice = Number(market.midPrice) || 0;

        element.exchanges[index].symbol =
          market.name !== "plenty network"
            ? `XTZ/${element.symbol}`
            : market.symbol;
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
