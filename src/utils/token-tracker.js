import axios from "axios";
import BigNumber from "bignumber.js";
import utils from ".";
import dexIndexer from "./dex-indexer";
import ipfs from "./ipfs";
import tzkt from "./tzkt";

const ALIEN_FEE_DENOMINATOR = new BigNumber(1000000000000000000n);
const twentyFourHrs = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const fourtyEightHrs = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
const oneHourInMiliSecond = 60 * 60 * 1000;
const oneDayInMiliSecond = oneHourInMiliSecond * 24;
const oneWeekInMiliSecond = oneDayInMiliSecond * 7;
const oneMonthInMiliSecond = oneDayInMiliSecond * 30;
const oneMonthAgo = new Date(Date.now() - oneMonthInMiliSecond).toISOString();
const PLY_TOKEN_ID = "KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX_0";

async function getPlentyTokenDailyMetrics(symbol = "") {
  const uri = `https://api.analytics.plenty.network/analytics/tokens/${symbol}?priceHistory=day`;
  const res = await (await axios.get(uri)).data;

  return res;
}

async function getSpicyTokenDailyMetrics(tag = "") {
  const uri = `https://spicyb.sdaotools.xyz/api/rest/TokenDailyMetrics?_ilike=${tag}`;
  const res = await (await axios.get(uri)).data;

  return res;
}

function getAggregatedOpen(pools, quote, wtzTokenPrice) {
  let totalReserves = 0;
  let aggregatedOpen = 0;
  for (const pool of pools) {
    const reserves = parseFloat(pool[quote]?.volume_quote);
    let open = 0;
    if (pool?.quotes_spot?.quote_token_address === "tez") {
      open = pool[quote]?.open;
      // Token has pool paired with wtz
    } else {
      open = pool[quote]?.open * wtzTokenPrice;
    }
    totalReserves += reserves;
    aggregatedOpen += reserves * open;
  }
  return totalReserves > 0 ? aggregatedOpen / totalReserves : 0;
}

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function sameHour(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate() &&
    d1.getHours() === d2.getHours()
  );
}

function findElementWithSameDate(array, targetDate) {
  return array.find((element) => {
    const date = element.bucket;
    return sameDay(new Date(date), new Date(targetDate));
  });
}

function findElementsWithSameHour(array, targetDate) {
  return array.filter((element) => {
    const date = element.bucket;
    return sameHour(new Date(date), new Date(targetDate));
  });
}

function binarySearch(arr, target) {
  const d = new Date(target);
  // Find the middle element of the array
  const mid = Math.floor(arr.length / 2);

  // If the target is less than the middle element, search the left half of the array
  if (d < new Date(arr[mid][0])) {
    // If the left half of the array is empty, return the index of the middle element
    if (mid === 0) {
      return arr[mid][1]?.usd;
    } else {
      return binarySearch(arr.slice(0, mid), d);
    }
  }
  // If the target is greater than the middle element, search the right half of the array
  else if (d > new Date(arr[mid][0])) {
    // If the right half of the array is empty, return the index of the middle element
    if (mid === arr.length - 1) {
      return arr[mid][1]?.usd;
    } else {
      return binarySearch(arr.slice(mid + 1), d);
    }
  }
  // If the target is equal to the middle element, return the index of the middle element
  else {
    return arr[mid][1]?.usd;
  }
}

function isEmptyArray(array) {
  if (!Array.isArray(array) || array.length === 0) return true;
  return false;
}

function modifyObject(obj, keyPairs) {
  obj = obj.map((element) => {
    keyPairs.forEach((pair) => {
      element[pair.newKey] = element[pair.oldKey];
    });
    return element;
  });
  return obj;
}

function modifySpicyMetrics(spicyMetrics, xtzUsdHistory) {
  const modifiedSpicyMetrics = {
    price: {
      history: [],
    },
    volume: {
      history: [],
    },
    tvl: {
      history: [],
    },
  };
  modifiedSpicyMetrics.price.history = spicyMetrics.map((element) => {
    const dateString = Object.keys(element)[0];
    const date = Number(dateString) * 1000;
    const timeUsdValue = binarySearch(
      xtzUsdHistory,
      new Date(date).getTime() + oneDayInMiliSecond
    );
    return {
      bucket: new Date(element.day).getTime(),
      usdClose: element.derivedusd_close,
      xtzClose: element.derivedusd_close / timeUsdValue,
    };
  });
  modifiedSpicyMetrics.volume.history = spicyMetrics.map((element) => {
    return {
      bucket: new Date(element.day).getTime(),
      usdVolume: element.dailyvolumeusd,
      xtzVolume: element.dailyvolumextz,
    };
  });
  modifiedSpicyMetrics.tvl.history = spicyMetrics.map((element) => {
    return {
      bucket: new Date(element.day).getTime(),
      usdTvl: element.totalliquidityusd,
      xtzTvl: element.totalliquidityxtz,
    };
  });
  return modifiedSpicyMetrics;
}

function modifyPlentyMetrics(plentyMetrics, xtzUsdHistory) {
  const modifiedPlentyMetrics = {
    price: {
      history: [],
    },
    volume: {
      history: [],
    },
    tvl: {
      history: [],
    },
  };

  modifiedPlentyMetrics.price.history = plentyMetrics.price.history.map(
    (element) => {
      const dateString = Object.keys(element)[0];
      const date = Number(dateString) * 1000;
      const timeUsdValue = binarySearch(
        xtzUsdHistory,
        new Date(date).getTime() + oneDayInMiliSecond
      );
      return {
        bucket: date,
        xtzClose: Object.values(element)[0].c / timeUsdValue,
      };
    }
  );
  modifiedPlentyMetrics.volume.history = plentyMetrics.volume.history.map(
    (element) => {
      const dateString = Object.keys(element)[0];
      const date = Number(dateString) * 1000;
      const timeUsdValue = binarySearch(
        xtzUsdHistory,
        new Date(date).getTime() + oneDayInMiliSecond
      );
      return {
        bucket: date,
        xtzVolume: Object.values(element)[0] / timeUsdValue,
      };
    }
  );
  modifiedPlentyMetrics.tvl.history = plentyMetrics.tvl.history.map(
    (element) => {
      const dateString = Object.keys(element)[0];
      const date = Number(dateString) * 1000;
      const timeUsdValue = binarySearch(
        xtzUsdHistory,
        new Date(date).getTime() + oneDayInMiliSecond
      );
      return {
        bucket: date,
        xtzTvl: Object.values(element)[0] / timeUsdValue,
      };
    }
  );
  return modifiedPlentyMetrics;
}

function getAggregatedPriceAndVolume(quotes) {
  const aggregatedQuotes = [];

  while (quotes.length > 0) {
    const quote = quotes[0];

    // Get all quote from same time
    const matchingElements = findElementsWithSameHour(quotes, quote.bucket);
    // Exclude elment having pools as empty array
    const filteredElements = matchingElements.filter(
      (item) => item.quote_token.pools.length > 0
    );

    if (filteredElements.length > 0) {
      // Get total volume in xtz
      const totalVolume = filteredElements.reduce((sum, element) => {
        element.volume_quote =
          element.volume_quote === "NaN" ? 0 : element.volume_quote;
        element.close = element.close === "NaN" ? 0 : element.close;
        if (element.quote_token_address !== "tez") {
          const quotePrice = element.quote_token.pools[0]?.quotes_spot?.quote;
          element.volume_quote_xtz =
            quotePrice && element.close ? element.volume_quote * quotePrice : 0;
        }

        return (
          sum +
          (element.quote_token_address !== "tez"
            ? element.volume_quote_xtz
            : element.volume_quote)
        );
      }, 0);

      // Get weighted price sum in xtz
      const weightedCloseSum = filteredElements.reduce((sum, element) => {
        element.volume_quote =
          element.volume_quote === "NaN" ? 0 : element.volume_quote;
        element.close = element.close === "NaN" ? 0 : element.close;
        let weightedClose = 0;

        if (element.quote_token_address !== "tez") {
          const quotePrice = element.quote_token.pools[0]?.quotes_spot?.quote;
          element.volume_quote_xtz = quotePrice
            ? element.volume_quote * quotePrice
            : 0;
          // Convert to weighted xtz price
          weightedClose = element.close * quotePrice * element.volume_quote_xtz;
        } else {
          weightedClose = element.close * element.volume_quote;
        }

        return sum + weightedClose;
      }, 0);

      const aggregatedClose = weightedCloseSum / totalVolume;
      const aggregatedXtzVolume = totalVolume;

      if (!isNaN(aggregatedClose)) {
        aggregatedQuotes.push({
          ...quote,
          aggregatedClose,
          aggregatedXtzVolume,
        });
      }

      quotes = quotes.filter(
        (q) => !matchingElements.some((element) => element.bucket === q.bucket)
      );
    } else {
      aggregatedQuotes.push(quote);
      quotes.shift();
    }
  }

  return aggregatedQuotes;
}

function getAggregatedTvl(stats, tokens) {
  const aggregatedStats = stats.map((stat) => {
    for (let index = 0; index < tokens.length; index++) {
      if (tokens[index] === null) {
        continue;
      }
      const tvl = findElementWithSameDate(
        tokens[index].tvl.history,
        stat.bucket
      );

      stat.aggregatedTvl = tvl?.bucket
        ? Number(tvl.xtzTvl) + Number(stat.aggregatedTvl)
        : Number(stat.aggregatedTvl);
    }
    return stat;
  });
  return aggregatedStats;
}

function getPlentyTokenChartData(indexes, kind, timeInterval, xtzUsdHistory) {
  let currentBucket = 0;
  let chartData = indexes.map((element) => {
    const stringDate = Object.keys(element)[0];
    const miliSecondDate = Number(stringDate) * 1000;

    if (miliSecondDate - currentBucket >= timeInterval) {
      currentBucket = miliSecondDate;
      const timeUsdValue = binarySearch(
        xtzUsdHistory,
        new Date(currentBucket).getTime() + oneDayInMiliSecond
      );
      const obj = {};
      obj[kind] =
        kind === "aggregatedClose"
          ? Number(Object.values(element)[0].c) / timeUsdValue
          : Number(Object.values(element)[0]) / timeUsdValue;
      obj.bucket = new Date(currentBucket).toISOString();
      return obj;
    } else {
      return null;
    }
  });
  chartData = chartData.filter((n) => n);
  return chartData;
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

  async getPriceAndVolumeQuotes(tokenAddress, tokenId) {
    let [quotes1h, quotes1d, quotes1w, quotes1mo] = await Promise.all([
      dexIndexer.getQuotes1H(tokenAddress, tokenId, oneMonthAgo),
      dexIndexer.getQuotes1D(tokenAddress, tokenId),
      dexIndexer.getQuotes1W(tokenAddress, tokenId),
      dexIndexer.getQuotes1MO(tokenAddress, tokenId),
    ]);

    // Reverse order of quotes in Chronological order
    [quotes1h, quotes1d, quotes1w, quotes1mo] = [
      quotes1h.reverse(),
      quotes1d.reverse(),
      quotes1w.reverse(),
      quotes1mo.reverse(),
    ];

    const aggregatedQuotes1h = getAggregatedPriceAndVolume(quotes1h);
    const aggregatedQuotes1d = getAggregatedPriceAndVolume(quotes1d);
    const aggregatedQuotes1w = getAggregatedPriceAndVolume(quotes1w);
    const aggregatedQuotes1mo = getAggregatedPriceAndVolume(quotes1mo);

    return {
      quotes1h: aggregatedQuotes1h,
      quotes1d: aggregatedQuotes1d,
      quotes1w: aggregatedQuotes1w,
      quotes1mo: aggregatedQuotes1mo,
    };
  },

  async getAllQuotes1d(tokenAddress, tokenId) {
    const [quotes1d] = await Promise.all([
      dexIndexer.getQuotes1D(tokenAddress, tokenId),
    ]);
    const aggregatedQuotes1d = getAggregatedPriceAndVolume(quotes1d);
    return aggregatedQuotes1d;
  },

  async getChartTvl(spicyId, tokenId, exchangeId, symbol, xtzUsdHistory) {
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
      plentyToken,
      spicyTokenMetrics,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query,
        variables: { tokenId: tokenId },
      }),
      getPlentyTokenDailyMetrics(symbol),
      getSpicyTokenDailyMetrics(spicyId),
    ]);

    let plyTvlChartData1d = [];
    let plyTvlChartData1w = [];
    let plyTvlChartData1mo = [];
    if (tokenId === PLY_TOKEN_ID) {
      plyTvlChartData1d = getPlentyTokenChartData(
        plentyToken[0].tvl.history,
        "aggregatedTvl",
        oneDayInMiliSecond,
        xtzUsdHistory
      );

      plyTvlChartData1w = getPlentyTokenChartData(
        plentyToken[0].tvl.history,
        "aggregatedTvl",
        oneWeekInMiliSecond,
        xtzUsdHistory
      );

      plyTvlChartData1mo = getPlentyTokenChartData(
        plentyToken[0].tvl.history,
        "aggregatedTvl",
        oneMonthInMiliSecond,
        xtzUsdHistory
      );
    }

    const keyPairs = [
      {
        newKey: "aggregatedTvl",
        oldKey: "tvl",
      },
    ];

    const modifiedSpicyMetrics = !isEmptyArray(spicyTokenMetrics.token_day_data)
      ? modifySpicyMetrics(spicyTokenMetrics.token_day_data, xtzUsdHistory)
      : null;
    const modifiedPlentyMetrics = !isEmptyArray(plentyToken[0]?.price.history)
      ? modifyPlentyMetrics(plentyToken[0], xtzUsdHistory)
      : null;
    const tokenList = [modifiedSpicyMetrics, modifiedPlentyMetrics];

    let aggregatedTvl1Day = modifyObject(stats1d, keyPairs);
    aggregatedTvl1Day =
      isEmptyArray(stats1d) && isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedTvl1Day
        : getAggregatedTvl(stats1d, tokenList);

    let aggregatedTvl7Day = modifyObject(stats1w, keyPairs);
    aggregatedTvl7Day =
      isEmptyArray(stats1w) && isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedTvl7Day
        : getAggregatedTvl(stats1w, tokenList);

    let aggregatedTvl30Day = modifyObject(stats1mo, keyPairs);
    aggregatedTvl30Day =
      isEmptyArray(stats1mo) && isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedTvl30Day
        : getAggregatedTvl(stats1mo, tokenList);

    let aggregatedTvlAll = modifyObject(stats1d, keyPairs);
    aggregatedTvlAll =
      isEmptyArray(stats1d) && isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedTvlAll
        : getAggregatedTvl(stats1d, tokenList);

    return {
      tvl1Day: tokenId === PLY_TOKEN_ID ? plyTvlChartData1d : aggregatedTvl1Day,
      tvl30Day:
        tokenId === PLY_TOKEN_ID ? plyTvlChartData1mo : aggregatedTvl30Day,
      tvl7Day: tokenId === PLY_TOKEN_ID ? plyTvlChartData1w : aggregatedTvl7Day,
      tvlAll: tokenId === PLY_TOKEN_ID ? plyTvlChartData1d : aggregatedTvlAll,
    };
  },

  async getTokenFeed() {
    try {
      const xtzUSD = await tzkt.getXtzUsdPrice();
      const [allTokenMetadata, allTokenSpot, allTokenPool, wtzToken] =
        await Promise.all([
          dexIndexer.getAllTokens(),
          dexIndexer.getAllTokenSpot(),
          dexIndexer.getAllTokenPools(),
          dexIndexer.getToken("KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn", "0"),
        ]);

      const wtzTokenPrice = wtzToken.pools[0].quotes_spot.quote;

      const tokenObjkt = {};

      const updatedIndexerTokens = {};

      for (let index = 0; index < allTokenMetadata.length; index++) {
        let el = allTokenMetadata[index];
        el.token_id = el.token_id || 0;
        el.id = el.token_address + "_" + el.token_id;

        el = utils.convertObjSnakeToCamel(el);

        updatedIndexerTokens[el.id] = el;
      }

      for (let index = 0; index < allTokenSpot.length; index++) {
        const element = allTokenSpot[index];
        element.id = element.token_address + "_" + element.token_id;
        const tokenMetadata = updatedIndexerTokens[element.id];

        /**
     *Calculate aggregated price 
     weighted on tvl from Plenty, Spicy and Quipu
      */
        let totalReserves = 0;
        let aggregatedClose = 0;
        let close = 0;

        for (const pool of element.pools) {
          const reserves = parseFloat(pool.reserves);
          
          // Token has pool paired with xtz
          if (pool?.quotes_spot?.quote_token_address === "tez") {
            close = pool.quotes_spot.quote;
            // Token has pool paired with wtz
          } else {
            close = pool.quotes_spot.quote * wtzTokenPrice;
          }
          totalReserves += reserves;
          aggregatedClose += reserves * close;
        }

        element.aggregatedPrice = aggregatedClose / totalReserves;
        element.dayClose = getAggregatedOpen(
          element.pools,
          "quotes_1d",
          wtzTokenPrice
        );
        element.weekClose = getAggregatedOpen(
          element.pools,
          "quotes_1w",
          wtzTokenPrice
        );
        element.monthClose = getAggregatedOpen(
          element.pools,
          "quotes_1mo",
          wtzTokenPrice
        );

        element.dayCloseUsd = element.dayClose * xtzUSD;
        element.weekCloseUsd = element.weekClose * xtzUSD;
        element.monthCloseUsd = element.monthClose * xtzUSD;

        let volume24Xtz = 0;
        let tokenTvl = 0;
        let tokenTvlUsd = 0;

        // Assign exchanges property to pools
        const tokenPools = allTokenPool.find(
          (el) =>
            el.token_address === element.token_address &&
            el.token_id === element.token_id
        ).pools;

        // Filter pools from dex that stores all pools in 1 contract(QuipV2, QuipStable, QuipToken2Token)
        const filteredPools = tokenPools.map((e) => {
          const poolIdToKeep = e.pool_id;
          // Filter 'dex.pools' based on 'pool_id'
          e.dex.pools = e.dex.pools.filter(
            (pool) => pool.pool_id === poolIdToKeep
          );
          return e;
        });
        element.exchanges = filteredPools;

        element.exchanges.forEach((e, index) => {
          // Calculate exchanges infor
          const quoteToken = allTokenSpot.find(
            (ele) =>
              ele.token_address === e.quotes_1d?.quote_token_address &&
              ele.token_id === e.quotes_1d?.quote_token_id
          );
          const volume =
            quoteToken?.token_address === "tez"
              ? e.quotes_1d?.volume_quote
              : e.quotes_1d?.volume_quote *
                quoteToken?.pools[0]?.quotes_spot?.quote;
          const midPrice =
            quoteToken?.token_address === "tez"
              ? e.quotes_spot?.quote
              : e.quotes_spot?.quote * quoteToken?.pools[0]?.quotes_spot?.quote;
          // Assign name and 24h volume for each exchange
          e.name = e.dex.dex_type;
          e.midPrice = midPrice || 0;
          e.volume24 = new BigNumber(volume || 0);
          // Calculate total volume 24h in xtz
          volume24Xtz = new BigNumber(volume24Xtz).plus(e.volume24).toNumber();
        });

        /**
         *Calculate tvl for each exchange
         */
        element.exchanges.forEach((e, index) => {
          const token = element.exchanges[index].dex.pools.find(
            (ele) =>
              ele.token_address === element.token_address &&
              ele.token_id === element.token_id
          );

          let tokenReserves = 0;
          if (e.dex.dex_type === "alien") {
            tokenReserves =
              token?.reserves /
              (ALIEN_FEE_DENOMINATOR * Math.pow(10, token?.token.decimals));
          } else {
            tokenReserves =
              token?.reserves / Math.pow(10, token?.token.decimals);
          }
          element.exchanges[index].tokenTvl =
            new BigNumber(tokenReserves * element.aggregatedPrice).toNumber() ||
            0;
          element.exchanges[index].tokenTvlUsd =
            new BigNumber(
              tokenReserves * element.aggregatedPrice * xtzUSD
            ).toNumber() || 0;
        });
        /**
         *Calculate total tvl and volume for each token
         */
        element.exchanges.forEach((e, index) => {
          tokenTvl = new BigNumber(tokenTvl).plus(e.tokenTvl).toNumber();
          tokenTvlUsd = new BigNumber(tokenTvlUsd)
            .plus(e.tokenTvl * xtzUSD)
            .toNumber();
        });
        /**
         *Calculate price changes
         */

        tokenObjkt[element.id] = {
          ...element,
          ...tokenMetadata,
          // ...closes,
          currentPrice: Number(element.aggregatedPrice),
          // allTimeLow: tokenQuotesTotal?.low || 0,
          tokenTvl,
          tokenTvlUsd,
          volume24Xtz,
        };
      }

      // console.log("tokenObjkt", tokenObjkt);
      return { ...updatedIndexerTokens, ...tokenObjkt };
    } catch (error) {
      console.log();
      console.log("error", error);
    }
  },
  async calcHolders(token) {
    const [address, tokenId] = token.id?.split("_");

    const uri = `https://api.tzkt.io/v1/tokens?select=contract,tokenId,holdersCount&limit=10000&contract=${address}&tokenId=${tokenId}`;
    await axios.get(uri).then((res) => {
      token.holders = res.data[0] ? res.data[0].holdersCount : 0;
    });

    return token;
  },

  async calculateTokenData(element, token, tokenFeed, xtzUsd) {
    // console.log("element", element);

    if (element) {
      element.thumbnailUri = ipfs.transformUri(
        element.thumbnailUri ||
          "https://static.thenounproject.com/png/796573-200.png"
      );

      const currentPrice =
        new BigNumber(element?.currentPrice).toNumber() || false;
      element.currentPrice = currentPrice;

      const price = new BigNumber(currentPrice);

      const priceUsd = price.times(xtzUsd);
      element.usdValue = price.times(xtzUsd).toNumber();

      element.calcSupply = new BigNumber(element.totalSupply)
        .div(new BigNumber(10).pow(element.decimals))
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

      element.exchanges = element.exchanges || [];

      for (let index = 0; index < element?.exchanges.length; index++) {
        const market = element?.exchanges[index];

        element.exchanges[index].lpPriceUsd =
          Number(market.midPrice) * xtzUsd || 0;
        element.exchanges[index].lpPrice = Number(market.midPrice) || 0;
        const quoteToken = element.exchanges[index].dex.pools.find(
          (ele) =>
            ele.token_address !== element.token_address ||
            ele.token_id !== element.token_id
        );
        element.exchanges[
          index
        ].symbol = `${quoteToken.token.symbol}/${element.symbol}`;
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
