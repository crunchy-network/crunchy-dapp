import axios from "axios";
import BigNumber from "bignumber.js";
import utils from ".";
import dexIndexer from "./dex-indexer";
import ipfs from "./ipfs";
import queryDipdup from "./queryDipdup";
import tzkt from "./tzkt";

const day1 = new Date(new Date().setDate(new Date().getDate() - 1)).getTime();
const day7 = new Date(new Date().setDate(new Date().getDate() - 7)).getTime();
const day30 = new Date(new Date().setDate(new Date().getDate() - 30)).getTime();
const twentyFourHrs = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const fourtyEightHrs = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
const oneHourInMiliSecond = 60 * 60 * 1000;
const oneDayInMiliSecond = oneHourInMiliSecond * 24;
const oneWeekInMiliSecond = oneDayInMiliSecond * 7;
const oneMonthInMiliSecond = oneDayInMiliSecond * 30;
const PLY_SYMBOL = "PLY";
const PLY_TOKEN_ID = "KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX_0";
const TRACKED_MARKETS_NAME = {
  plentyNetwork: {
    name: "plenty network",
  },
  spicyswap: {
    name: "spicyswap",
  },
};

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

async function getPlentyTokenDailyMetrics(symbol = "") {
  const uri = `https://api.analytics.plenty.network/analytics/tokens/${symbol}?priceHistory=day`;
  const res = await (await axios.get(uri)).data;

  return res;
}

async function getPlentyTokenHourlyMetrics(symbol = "") {
  const uri = `https://api.analytics.plenty.network/analytics/tokens/${symbol}`;
  const res = await (await axios.get(uri)).data;

  return res;
}

async function getSpicyTokenDailyMetrics(tag = "") {
  const uri = `https://spicyb.sdaotools.xyz/api/rest/TokenDailyMetrics?_ilike=${tag}`;
  const res = await (await axios.get(uri)).data;

  return res;
}

async function getSpicyTokens() {
  const uri = `https://spicyb.sdaotools.xyz/api/rest/TokenList`;
  const res = await (await axios.get(uri)).data;

  return res;
}

async function getSpicyPools() {
  const uri = `https://spicyb.sdaotools.xyz/api/rest/PoolListAll?hour_agg_start=${Math.floor(
    day1 / 1000
  )}`;
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
  return (
    (Number(num1) * Number(index1) + Number(num2) * Number(index2)) /
    (Number(index1) + Number(index2))
  );
}

function aggregateMultiple(array) {
  let aggreagatedDividend = 0;
  let aggregatedQuotient = 0;
  for (let index = 0; index < array.length; index++) {
    aggreagatedDividend +=
      Number(array[index].num) * Number(array[index].index);
    aggregatedQuotient += Number(array[index].index);
  }
  return aggreagatedDividend / aggregatedQuotient;
}

function findElementWithSameDate(array, targetDate) {
  return array.find((element) => {
    const date = element.bucket;
    return sameDay(new Date(date), new Date(targetDate));
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

function modifySpicyMetrics(spicyMetrics) {
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
    return {
      bucket: new Date(element.day).getTime(),
      usdClose: element.derivedusd_close,
      xtzClose: element.derivedxtz_close,
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
        new Date(date).getTime() + 1000 * 60 * 60 * 24
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
        new Date(date).getTime() + 1000 * 60 * 60 * 24
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
        new Date(date).getTime() + 1000 * 60 * 60 * 24
      );
      return {
        bucket: date,
        xtzTvl: Object.values(element)[0] / timeUsdValue,
      };
    }
  );
  return modifiedPlentyMetrics;
}

function getAggregatedPriceAndVolume(quotesNogaps, tokens) {
  const aggregatedQuotesNoGaps = quotesNogaps.map((quote) => {
    for (let index = 0; index < tokens.length; index++) {
      if (tokens[index] === null) {
        continue;
      }
      const price = findElementWithSameDate(
        tokens[index].price.history,
        quote.bucket
      );
      const volume = findElementWithSameDate(
        tokens[index].volume.history,
        quote.bucket
      );

      quote.aggregatedClose = price?.bucket
        ? aggregate(
            price.xtzClose,
            quote.aggregatedClose,
            volume.xtzVolume,
            quote.xtzVolume
          )
        : Number(quote.aggregatedClose);
      quote.aggregatedXtzVolume = volume?.bucket
        ? Number(volume.xtzVolume) + Number(quote.aggregatedXtzVolume)
        : Number(quote.aggregatedXtzVolume);
    }
    return quote;
  });
  return aggregatedQuotesNoGaps;
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
        new Date(currentBucket).getTime() + 1000 * 60 * 60 * 24
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

  async getPriceAndVolumeQuotes(spicyId, tokenId, symbol, xtzUsdHistory) {
    const query = `
    query MyQuery($tokenId: String) {
      quotes1hNogaps (
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
          data: { quotes1hNogaps, quotes1dNogaps, quotes1wNogaps, quotes1mo },
        },
      },
      plentyToken,
      hourlyPlentyToken,
      spicyTokenMetrics,
    ] = await Promise.all([
      axios.post("https://dex.dipdup.net/v1/graphql", {
        query,
        variables: { tokenId: tokenId },
      }),
      getPlentyTokenDailyMetrics(symbol),
      getPlentyTokenHourlyMetrics(symbol),
      getSpicyTokenDailyMetrics(spicyId),
    ]);

    const keyPairs = [
      {
        newKey: "aggregatedClose",
        oldKey: "close",
      },
      {
        newKey: "aggregatedXtzVolume",
        oldKey: "xtzVolume",
      },
    ];

    const modifiedHourlySpicyMetrics = !isEmptyArray(
      spicyTokenMetrics.token_hour_data
    )
      ? modifySpicyMetrics(spicyTokenMetrics.token_hour_data)
      : null;
    const modifiedHourlyPlentyMetrics = !isEmptyArray(
      hourlyPlentyToken[0]?.price.history
    )
      ? modifyPlentyMetrics(hourlyPlentyToken[0], xtzUsdHistory)
      : null;
    const hourlyTokenList = [
      modifiedHourlySpicyMetrics,
      modifiedHourlyPlentyMetrics,
    ];

    const modifiedDailySpicyMetrics = !isEmptyArray(
      spicyTokenMetrics.token_day_data
    )
      ? modifySpicyMetrics(spicyTokenMetrics.token_day_data)
      : null;
    const modifiedDailyPlentyMetrics = !isEmptyArray(
      plentyToken[0]?.price.history
    )
      ? modifyPlentyMetrics(plentyToken[0], xtzUsdHistory)
      : null;
    const dailyTokenList = [
      modifiedDailySpicyMetrics,
      modifiedDailyPlentyMetrics,
    ];

    let aggregatedQuotes1hNoGaps = modifyObject(quotes1hNogaps, keyPairs);
    aggregatedQuotes1hNoGaps =
      isEmptyArray(quotes1hNogaps) &&
      isEmptyArray(spicyTokenMetrics.token_hour_data)
        ? aggregatedQuotes1hNoGaps
        : getAggregatedPriceAndVolume(quotes1hNogaps, hourlyTokenList);

    let aggregatedQuotes1dNoGaps = modifyObject(quotes1dNogaps, keyPairs);
    aggregatedQuotes1dNoGaps =
      isEmptyArray(quotes1dNogaps) &&
      isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedQuotes1dNoGaps
        : getAggregatedPriceAndVolume(quotes1dNogaps, dailyTokenList);

    let aggregatedQuotes1wNoGaps = modifyObject(quotes1wNogaps, keyPairs);
    aggregatedQuotes1wNoGaps =
      isEmptyArray(quotes1wNogaps) &&
      isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedQuotes1wNoGaps
        : getAggregatedPriceAndVolume(quotes1wNogaps, dailyTokenList);

    let aggregatedQuotes1moNoGaps = modifyObject(quotes1mo, keyPairs);
    aggregatedQuotes1moNoGaps =
      isEmptyArray(quotes1mo) && isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedQuotes1moNoGaps
        : getAggregatedPriceAndVolume(quotes1mo, dailyTokenList);

    /*
      *Calculate PLY price and volume for chart data
    */
    let plyPriceAndVolumeChartData1h = [];
    let plyPriceAndVolumeChartData1d = [];
    let plyPriceAndVolumeChartData1w = [];
    let plyPriceAndVolumeChartData1mo = [];
    if (tokenId === PLY_TOKEN_ID) {
      const plyPriceChartData1h = getPlentyTokenChartData(
        hourlyPlentyToken[0].price.history,
        "aggregatedClose",
        oneHourInMiliSecond,
        xtzUsdHistory
      );

      const plyVolumeChartData1h = getPlentyTokenChartData(
        hourlyPlentyToken[0].volume.history,
        "aggregatedXtzVolume",
        oneHourInMiliSecond,
        xtzUsdHistory
      );
      plyPriceAndVolumeChartData1h = plyPriceChartData1h.map((item, i) => {
          const index = plyVolumeChartData1h.findIndex(volumeItem => volumeItem.bucket === item.bucket);
          if (index !== -1) {
            return Object.assign({}, item, plyVolumeChartData1h[index]);
          }
          return item;
        }
      );

      const plyPriceChartData1d = getPlentyTokenChartData(
        plentyToken[0].price.history,
        "aggregatedClose",
        oneDayInMiliSecond,
        xtzUsdHistory
      );
      const plyVolumeChartData1d = getPlentyTokenChartData(
        plentyToken[0].volume.history,
        "aggregatedXtzVolume",
        oneDayInMiliSecond,
        xtzUsdHistory
      );
      plyPriceAndVolumeChartData1d = plyPriceChartData1d.map((item, i) =>
        Object.assign({}, item, plyVolumeChartData1d[i])
      );

      const plyPriceChartData1w = getPlentyTokenChartData(
        plentyToken[0].price.history,
        "aggregatedClose",
        oneWeekInMiliSecond,
        xtzUsdHistory
      );
      const plyVolumeChartData1w = getPlentyTokenChartData(
        plentyToken[0].volume.history,
        "aggregatedXtzVolume",
        oneWeekInMiliSecond,
        xtzUsdHistory
      );
      plyPriceAndVolumeChartData1w = plyPriceChartData1w.map((item, i) =>
        Object.assign({}, item, plyVolumeChartData1w[i])
      );

      const plyPriceChartData1mo = getPlentyTokenChartData(
        plentyToken[0].price.history,
        "aggregatedClose",
        oneMonthInMiliSecond,
        xtzUsdHistory
      );
      const plyVolumeChartData1mo = getPlentyTokenChartData(
        plentyToken[0].volume.history,
        "aggregatedXtzVolume",
        oneMonthInMiliSecond,
        xtzUsdHistory
      );
      plyPriceAndVolumeChartData1mo = plyPriceChartData1mo.map((item, i) =>
        Object.assign({}, item, plyVolumeChartData1mo[i])
      );
    }

    return {
      quotes1h:
      tokenId === PLY_TOKEN_ID
          ? plyPriceAndVolumeChartData1h
          : aggregatedQuotes1hNoGaps,
      quotes1d:
        tokenId === PLY_TOKEN_ID
          ? plyPriceAndVolumeChartData1d
          : aggregatedQuotes1dNoGaps,
      quotes1w:
        tokenId === PLY_TOKEN_ID
          ? plyPriceAndVolumeChartData1w
          : aggregatedQuotes1wNoGaps,
      quotes1mo:
        tokenId === PLY_TOKEN_ID
          ? plyPriceAndVolumeChartData1mo
          : aggregatedQuotes1moNoGaps,
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

  async getAllQuotes1d(spicyId, tokenId, symbol, xtzUsdHistory) {
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

    const keyPairs = [
      {
        newKey: "aggregatedXtzVolume",
        oldKey: "xtzVolume",
      },
    ];

    const modifiedSpicyMetrics = !isEmptyArray(spicyTokenMetrics.token_day_data)
      ? modifySpicyMetrics(spicyTokenMetrics.token_day_data)
      : null;
    const modifiedPlentyMetrics = !isEmptyArray(plentyToken[0]?.price.history)
      ? modifyPlentyMetrics(plentyToken[0], xtzUsdHistory)
      : null;
    const tokenList = [modifiedSpicyMetrics, modifiedPlentyMetrics];

    let aggregatedQuotes1dNoGaps = modifyObject(quotes1dNogaps, keyPairs);
    aggregatedQuotes1dNoGaps =
      isEmptyArray(quotes1dNogaps) &&
      isEmptyArray(spicyTokenMetrics.token_day_data)
        ? aggregatedQuotes1dNoGaps
        : getAggregatedPriceAndVolume(quotes1dNogaps, tokenList);

    if (tokenId === "KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX_0") {
      return getPlentyTokenChartData(
        plentyToken[0].volume.history,
        "aggregatedXtzVolume",
        oneDayInMiliSecond,
        xtzUsdHistory
      );
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
      ? modifySpicyMetrics(spicyTokenMetrics.token_day_data)
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
      // const xtzUsdHistory = await coingecko.getXtzUsdHistory();
      const xtzUsdHistory = await tzkt.getXtzUsdHistory();

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
       standard
     }
   }`;

      const [
        allTokensMetadata,

        {
          data: {
            data: { quotesTotal, statsTotal, token },
          },
        },
        tokensCloseData,
        plentyTokens,
        PLY,
        plentyPools,
        spicyTokens,
        spicyPools,
      ] = await Promise.all([
        dexIndexer.getAllTokens(),
        axios.post("https://dex.dipdup.net/v1/graphql", {
          query,
        }),
        queryDipdup.getTokensPriceClose(),
        getPlentyTokenDailyMetrics(),
        getPlentyTokenDailyMetrics(PLY_SYMBOL),
        getPlentyPools(),
        getSpicyTokens(),
        getSpicyPools(),
      ]);

      quotesTotal.push({
        close: PLY[0].price.value / xtzUSD,
        tokenId: `${PLY[0].contract}_0`,
      });

      /*
       *Calculate PLY data and push to token list
       */
      const updatedPLY = PLY.map((obj) => {
        return {
          exchanges: [],
          address: obj.contract,
          decimals: obj.decimals,
          id: `${obj.contract}_0`,
          name: obj.name,
          tokenId: 0,
          symbol: obj.token,
          thumbnailUri: "",
        };
      });
      const modifiedPlyMetrics = modifyPlentyMetrics(PLY[0], xtzUsdHistory);

      const price1Day = findElementWithSameDate(
        modifiedPlyMetrics.price.history,
        new Date(day1).toISOString()
      );
      const price7Day = findElementWithSameDate(
        modifiedPlyMetrics.price.history,
        new Date(day7).toISOString()
      );
      const price30Day = findElementWithSameDate(
        modifiedPlyMetrics.price.history,
        new Date(day30).toISOString()
      );

      const timeUsdValueDay1 = binarySearch(xtzUsdHistory, day1);
      const timeUsdValueDay7 = binarySearch(xtzUsdHistory, day7);
      const timeUsdValueDay30 = binarySearch(xtzUsdHistory, day30);

      updatedPLY[0].dayCloseUsd = price1Day ? Object.values(price1Day)[0].c : 0;
      updatedPLY[0].weekCloseUsd = price7Day ? Object.values(price7Day)[0].c : 0;
      updatedPLY[0].monthCloseUsd = price30Day ? Object.values(price30Day)[0].c : 0;
      updatedPLY[0].dayClose = updatedPLY[0].dayCloseUsd / timeUsdValueDay1;
      updatedPLY[0].weekClose = updatedPLY[0].weekCloseUsd / timeUsdValueDay7;
      updatedPLY[0].monthClose =
        updatedPLY[0].monthCloseUsd / timeUsdValueDay30;

      const currentPrice =
        new BigNumber(PLY[0].price.value).toNumber() || false;
      const price = new BigNumber(currentPrice);
      const priceXtz = new BigNumber(price.div(xtzUSD));

      const change1Day = priceXtz
        .minus(updatedPLY[0].dayClose)
        .div(updatedPLY[0].dayClose)
        .times(100)
        .toNumber();
      const change7Day = priceXtz
        .minus(updatedPLY[0].weekClose)
        .div(updatedPLY[0].weekClose)
        .times(100)
        .toNumber();
      const change30Day = priceXtz
        .minus(updatedPLY[0].monthClose)
        .div(updatedPLY[0].monthClose)
        .times(100)
        .toNumber();

      const change1DayUsd = price
        .minus(updatedPLY[0].dayCloseUsd)
        .div(updatedPLY[0].dayCloseUsd)
        .times(100)
        .toNumber();
      const change7DayUsd = price
        .minus(updatedPLY[0].weekCloseUsd)
        .div(updatedPLY[0].weekCloseUsd)
        .times(100)
        .toNumber();
      const change30DayUsd = price
        .minus(updatedPLY[0].monthCloseUsd)
        .div(updatedPLY[0].monthCloseUsd)
        .times(100)
        .toNumber();

      updatedPLY[0].change1Day = change1Day === Infinity ? 0 : change1Day || 0;
      updatedPLY[0].change7Day = change7Day === Infinity ? 0 : change7Day || 0;
      updatedPLY[0].change30Day =
        change30Day === Infinity ? 0 : change30Day || 0;

      updatedPLY[0].change1DayUsd =
        change1DayUsd === Infinity ? 0 : change1DayUsd || 0;
      updatedPLY[0].change7DayUsd =
        change7DayUsd === Infinity ? 0 : change7DayUsd || 0;
      updatedPLY[0].change30DayUsd =
        change30DayUsd === Infinity ? 0 : change30DayUsd || 0;

      token.push(updatedPLY[0]);

      /*
       *Format plenty pools and spicy pools for integration
       */
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
          name: TRACKED_MARKETS_NAME.plentyNetwork.name,
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

      let updatedSpicyPools = spicyPools.pair_info.map(function (obj) {
        const baseSymbol = token.filter((element) => {
          const tokenId = obj.token0.split(":")[1];
          obj.token0Id = obj.token0.replace(":", "_");
          if (tokenId === "null") {
            obj.token0Id = obj.token0Id.replace("null", "0");
          }
          return element.id === obj.token0Id;
        })[0]?.symbol;

        const quoteSymbol = token.filter((element) => {
          const tokenId = obj.token1.split(":")[1];
          obj.token1Id = obj.token1.replace(":", "_");
          if (tokenId === "null") {
            obj.token1Id = obj.token1Id.replace("null", "0");
          }
          return element.id === obj.token1Id;
        })[0]?.symbol;

        const poolSymbol = baseSymbol + "/" + quoteSymbol;

        if (poolSymbol.includes("undefined")) {
          return null;
        } else {
          const baseToken = spicyTokens.tokens.filter(
            (token) => token.symbol.toLowerCase() === baseSymbol.toLowerCase()
          );
          const quoteToken = spicyTokens.tokens.filter(
            (token) => token.symbol.toLowerCase() === quoteSymbol.toLowerCase()
          );
          return {
            address: obj.contract,
            name: TRACKED_MARKETS_NAME.spicyswap.name,
            symbol: poolSymbol,
            volume24:
              obj.pairHourData_aggregate.aggregate.sum.hourlyvolumextz !== null
                ? obj.pairHourData_aggregate.aggregate.sum.hourlyvolumextz
                : 0,
            volume24Usd:
              obj.pairHourData_aggregate.aggregate.sum.hourlyvolumeusd !== null
                ? obj.pairHourData_aggregate.aggregate.sum.hourlyvolumeusd
                : 0,
            baseSymbol: baseSymbol,
            quoteSymbol: quoteSymbol,
            basePrice: baseToken[0]?.derivedxtz
              ? baseToken[0]?.derivedxtz
              : baseToken[0]?.tokenDayData[0].last_price,
            quotePrice: quoteToken[0]?.derivedxtz
              ? quoteToken[0]?.derivedxtz
              : quoteToken[0]?.tokenDayData[0].last_price,
            basePriceUsd: baseToken[0]?.derivedusd
              ? baseToken[0]?.derivedusd
              : baseToken[0]?.tokenDayData[0].last_price,
            quotePriceUsd: quoteToken[0]?.derivedusd
              ? quoteToken[0]?.derivedusd
              : quoteToken[0]?.tokenDayData[0].last_price,
            tokenTvl: obj.reservextz,
            tokenTvlUsd: obj.reserveusd,
          };
        }
      });
      updatedSpicyPools = updatedSpicyPools.filter((n) => n);

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
        updatedSpicyPools.forEach(async (p) => {
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
              midPriceUsd:
                p.baseSymbol.toLowerCase() === t.symbol.toLowerCase()
                  ? p.basePriceUsd
                  : p.quotePriceUsd,
            };
            t.exchanges.push(exchange);
          }
        });
      });

      const tokensVolume = await queryXtzVolume();

      const tokenObjkt = {};

      const updatedIndexerTokens = {};

      for (let index = 0; index < allTokensMetadata.length; index++) {
        let el = allTokensMetadata[index];
        el.token_id = el.token_id || 0;
        el.id = el.token_address + "_" + el.token_id;

        el = utils.convertObjSnakeToCamel(el);

        updatedIndexerTokens[el.id] = el;
      }

      for (let index = 0; index < token.length; index++) {
        const element = token[index];
        const tokenMetadata = updatedIndexerTokens[element.id];

        const tokenId = element.id;
        const closes = queryDipdup.filterTokenClose(tokenId, tokensCloseData);
        /**
     *Calculate aggregated price 
     weighted on tvl from Plenty, Spicy and Quipu
      */
        let tokenTvl1Day = [];
        const tokenQuotesTotal = quotesTotal.find(
          (quote) => quote.tokenId === tokenId
        );
        if (tokenQuotesTotal !== undefined) {
          tokenTvl1Day = statsTotal.filter((stat) => {
            return stat.tokenId === tokenQuotesTotal.tokenId;
          });
          tokenQuotesTotal.tvl = tokenTvl1Day.reduce(
            (totalTvl, exchange) => Number(totalTvl) + Number(exchange.tvl),
            0
          );

          const tokenOnPlenty = plentyTokens.find((token) => {
            const contract = tokenQuotesTotal.tokenId.split("_")[0];
            const id = tokenQuotesTotal.tokenId.split("_")[1];
            return token.standard === "FA2"
              ? token.contract === contract &&
                  String(token.tokenId) === String(id)
              : token.contract === contract;
          });
          if (tokenOnPlenty !== undefined) {
            tokenQuotesTotal.plentyClose = tokenOnPlenty.price.value / xtzUSD;
            tokenQuotesTotal.plentyTvl = tokenOnPlenty.tvl.value / xtzUSD;
          } else {
            tokenQuotesTotal.plentyClose = 0;
            tokenQuotesTotal.plentyTvl = 0;
          }

          const tokenOnSpicy = spicyTokens.tokens.find((token) => {
            const contract = tokenQuotesTotal.tokenId.split("_")[0];
            const id = tokenQuotesTotal.tokenId.split("_")[1];
            const spicyContract = token.tag.split(":")[0];
            let spicyId = token.tag.split(":")[1];
            if (spicyId === "null") {
              spicyId = 0;
            }
            return spicyContract === contract && String(spicyId) === String(id);
          });
          if (tokenOnSpicy !== undefined) {
            tokenQuotesTotal.spicyClose = tokenOnSpicy?.derivedxtz
              ? tokenOnSpicy?.derivedxtz
              : tokenOnSpicy?.tokenDayData[0].last_price;
            tokenQuotesTotal.spicyTvl = tokenOnSpicy.totalliquidityxtz;
          } else {
            tokenQuotesTotal.spicyClose = 0;
            tokenQuotesTotal.spicyTvl = 0;
          }

          const arr = [
            {
              num: tokenQuotesTotal.spicyClose,
              index: tokenQuotesTotal.spicyTvl,
            },
            {
              num: tokenQuotesTotal.plentyClose,
              index: tokenQuotesTotal.plentyTvl,
            },
            {
              num: tokenQuotesTotal.close,
              index: tokenQuotesTotal.tvl,
            },
          ];

          tokenQuotesTotal.aggregatedClose = aggregateMultiple(arr);
        }

        let volume24Xtz = 0;
        let tokenTvl = 0;
        let tokenTvlUsd = 0;

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

        /**
         *Calculate tvl for each exchange
         */
        statsTotal.forEach((s) => {
          element.exchanges.forEach((e, index) => {
            if (s.tokenId === tokenId && s.exchangeId === e.address) {
              element.exchanges[index].tokenTvl =
                new BigNumber(s?.tvl).toNumber() || 0;
              element.exchanges[index].tokenTvlUsd =
                new BigNumber(s?.tvlUsd).toNumber() || 0;
            }
          });
        });

        /**
         *Calculate total tvl and volume for each token
         */
        element.exchanges.forEach((e, index) => {
          tokenTvl = new BigNumber(tokenTvl).plus(e.tokenTvl).toNumber();
          tokenTvlUsd = new BigNumber(tokenTvlUsd)
            .plus(e.tokenTvl * xtzUSD)
            .toNumber();
          if (
            e.name === TRACKED_MARKETS_NAME.plentyNetwork.name ||
            e.name === TRACKED_MARKETS_NAME.spicyswap.name
          ) {
            volume24Xtz = new BigNumber(volume24Xtz)
              .plus(e.volume24)
              .toNumber();
          }
        });

        tokenObjkt[element.id] = {
          ...element,
          ...tokenMetadata,
          ...closes,
          currentPrice: Number(tokenQuotesTotal?.aggregatedClose),
          // allTimeLow: tokenQuotesTotal?.low || 0,
          tokenTvl,
          tokenTvlUsd,
          volume24Xtz,
        };
      }

      console.log("tokenObjkt", tokenObjkt);
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
    // const tokenPrice = tokenFeed[token.id];

    // tokenPrice.currentPrice = currentPrice;

    // const tokenMetadata = allTokensMetadata.find((el) => {
    //   return (
    //     el.token_address === token.tokenAddress &&
    //     (el.token_id !== undefined
    //       ? el.token_id === (token.tokenId || 0)
    //       : true)
    //   );
    // });

    // const element = tokenPrice;
    console.log("element", element);

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
      }

      element.volume24 = new BigNumber(element.volume24Xtz).toNumber();
      element.volume24Usd = new BigNumber(element.volume24Xtz)
        .times(xtzUsd)
        .toNumber();

      element.exchanges = element.exchanges || [];

      for (let index = 0; index < element?.exchanges.length; index++) {
        const market = element?.exchanges[index];
        element.exchanges[index].lpPriceUsd =
          market.name === "spicyswap"
            ? Number(market.midPriceUsd)
            : Number(market.midPrice) * xtzUsd || 0;

        element.exchanges[index].lpPrice = Number(market.midPrice) || 0;

        element.exchanges[index].symbol =
          market.name === "plenty network" || market.name === "spicyswap"
            ? market.symbol
            : `XTZ/${element.symbol}`;
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
