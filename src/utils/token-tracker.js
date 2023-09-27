import axios from "axios";
import BigNumber from "bignumber.js";
import utils from ".";
import dexIndexer from "./dex-indexer";
import ipfs from "./ipfs";
import tzkt from "./tzkt";
import _ from "lodash";

const ALIEN_FEE_DENOMINATOR = new BigNumber(1000000000000000000n);
const day1 = new Date(new Date().setDate(new Date().getDate() - 1)).getTime();
const day7 = new Date(new Date().setDate(new Date().getDate() - 7)).getTime();
const day30 = new Date(new Date().setDate(new Date().getDate() - 30)).getTime();
const oneHourInMiliSecond = 60 * 60 * 1000;
const oneDayInMiliSecond = oneHourInMiliSecond * 24;
const oneWeekInMiliSecond = oneDayInMiliSecond * 7;
const oneMonthInMiliSecond = oneDayInMiliSecond * 30;
const twoMonthInMiliSecond = oneDayInMiliSecond * 60;
// const oneDayAgo = new Date(Date.now() - oneDayInMiliSecond).toISOString();
// const oneWeekAgo = new Date(Date.now() - oneWeekInMiliSecond).toISOString();
const oneMonthAgo = new Date(Date.now() - oneMonthInMiliSecond).toISOString();
const twoMonthAgo = new Date(Date.now() - twoMonthInMiliSecond);
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

function aggregateQuotes(quotes) {
  let modifiedQuotes = [];
  quotes.forEach((quote, index) => {
    modifiedQuotes.push(quote.buckets);
  });
  modifiedQuotes = [].concat(...modifiedQuotes);
  return modifiedQuotes;
}

function modifyQuotes(quotes, allTokenSpot, type) {
  let quoteToken;
  let quoteTokenPriceInTez;
  quotes.forEach((quote, index) => {
    quoteToken = allTokenSpot.find(
      (el) =>
        quote.token.tokenAddress === el.tokenAddress &&
        quote.token.tokenId === el.tokenId
    );
    quoteTokenPriceInTez = quoteToken?.quotes.find(
      (el) => el.token.tokenAddress === "tez"
    )?.quote;

    // Only get element from one month for 1h chart
    if (type === "1h") {
      quote.buckets = quote.buckets.filter(
        (bucket) => new Date(bucket.bucket) > new Date(oneMonthAgo)
      );
    }
    // Only get element from two months for 1d chart
    if (type === "1d") {
      quote.buckets = quote.buckets.filter(
        (bucket) => new Date(bucket.bucket) > twoMonthAgo
      );
    }
    quote.buckets.map((bucket) => {
      bucket.dex_type = quote.pool.dex.type;
      bucket.quote_token_address = quote.token.tokenAddress;
      bucket.quote_token_id = quote.token.tokenId;
      bucket.close_xtz =
        quote.token.tokenAddress === "tez"
          ? Number(bucket.close)
          : Number(bucket.close) * Number(quoteTokenPriceInTez);
      bucket.volume_quote_xtz =
        quote.token.tokenAddress === "tez"
          ? Number(bucket.quoteVolume)
          : Number(bucket.quoteVolume) * Number(quoteTokenPriceInTez);
    });
  });
  return quotes;
}

function getAggregatedOpen(quotes, allTokenSpot) {
  let totalVolume = 0;
  let aggregatedOpen = 0;

  if (!quotes) {
    return 0;
  }

  for (const quote of quotes) {
    let volume = 0;
    let spot = 0;
    let quoteToken;
    let quoteTokenPriceInTez;
    let quoteTokenPriceInWTZ;
    if (quote.token.tokenAddress === "tez") {
      spot = quote.quote;
      volume = parseFloat(quote.quoteVolume);
      quote.spot_xtz = spot;
      quote.volume_xtz = volume;
      // Token has quote paired with wtz
    } else {
      quoteToken = allTokenSpot.find(
        (el) =>
          quote.token.tokenAddress === el.tokenAddress &&
          quote.token.tokenId === el.tokenId
      );
      quoteTokenPriceInTez = quoteToken?.quotes.find(
        (el) => el.token.tokenAddress === "tez"
      )?.quote;
      quoteTokenPriceInWTZ = quoteToken?.quotes.find(
        (el) => el.token.tokenAddress === "KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn"
      )?.quote;
      spot = isNaN(quoteTokenPriceInTez)
        ? quote.quote * quoteTokenPriceInWTZ
        : quote.quote * quoteTokenPriceInTez;
      volume = isNaN(quoteTokenPriceInTez)
        ? parseFloat(quote.quoteVolume) * quoteTokenPriceInWTZ
        : parseFloat(quote.quoteVolume) * quoteTokenPriceInTez;
      quote.spot_xtz = spot;
      quote.volume_xtz = volume;
    }
    if (isNaN(spot) || isNaN(volume)) {
      continue;
    }

    totalVolume += volume;
    aggregatedOpen += volume * spot;
  }
  return totalVolume > 0 ? aggregatedOpen / totalVolume : 0;
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

function getAggregatedPriceAndVolume(quotes, type) {
  const aggregatedQuotes = [];
  let prevAggCloseSum = 0;
  let prevAggVol = 0;
  // Exclude elment having no close price in xtz and volume quote is NaN
  let filteredQuotes = quotes.filter(
    (item) => !isNaN(item.close_xtz) && !isNaN(item.volume_quote_xtz)
  );
  while (filteredQuotes.length > 0) {
    // Get first element of quotes, remove the quote
    // and find all quote with same time
    const quote = filteredQuotes[0];
    filteredQuotes.shift();
    const matchingElements = findElementsWithSameHour(
      filteredQuotes,
      quote?.bucket
    );
    // Get aggregated close and volume
    if (matchingElements.length > 0) {
      const quoteVolume = parseFloat(quote.volume_quote_xtz);
      const quoteWeightedClose =
        parseFloat(quote.close_xtz) * parseFloat(quote.volume_quote_xtz);
      // Get total volume in xtz
      const totalVolume = matchingElements.reduce((sum, element) => {
        return sum + parseFloat(element.volume_quote_xtz);
      }, quoteVolume);

      // Get weighted price sum in xtz
      const weightedCloseSum = matchingElements.reduce((sum, element) => {
        return (
          sum +
          parseFloat(element.close_xtz) * parseFloat(element.volume_quote_xtz)
        );
      }, quoteWeightedClose);

      const aggregatedClose = weightedCloseSum / totalVolume;
      const aggregatedXtzVolume = totalVolume;
      prevAggCloseSum = weightedCloseSum;
      prevAggVol = aggregatedXtzVolume;

      if (!isNaN(aggregatedClose)) {
        aggregatedQuotes.push({
          ...quote,
          aggregatedClose,
          aggregatedXtzVolume,
        });
      }

      // Use the filter method to remove elements in matchingElements from quotes
      filteredQuotes = filteredQuotes.filter(
        (element) => !matchingElements.includes(element)
      );
    } else {
      if (quote) {
        const weightedCloseSum =
          quote.close_xtz * quote.volume_quote_xtz + prevAggCloseSum;
        const aggregatedXtzVolume = quote.volume_quote_xtz + prevAggVol;

        quote.aggregatedClose = weightedCloseSum / aggregatedXtzVolume;
        quote.aggregatedXtzVolume = quote.volume_quote_xtz;
        aggregatedQuotes.push(quote);
      }
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
  async getPriceAndVolumeQuotes(tokenAddress, tokenId) {
    let [quotes1h, quotes1d, quotes1w, quotes1mo, allTokenSpot] =
      await Promise.all([
        dexIndexer.getQuotes1H(tokenAddress, tokenId),
        dexIndexer.getQuotes1D(tokenAddress, tokenId),
        dexIndexer.getQuotes1W(tokenAddress, tokenId),
        dexIndexer.getQuotes1MO(tokenAddress, tokenId),
        dexIndexer.getAllTokenSpot(),
      ]);

    [quotes1h, quotes1d, quotes1w, quotes1mo] = [
      modifyQuotes(quotes1h[0].quotes, allTokenSpot, "1h"),
      modifyQuotes(quotes1d[0].quotes, allTokenSpot, "1d"),
      modifyQuotes(quotes1w[0].quotes, allTokenSpot),
      modifyQuotes(quotes1mo[0].quotes, allTokenSpot),
    ];

    [quotes1h, quotes1d, quotes1w, quotes1mo] = [
      aggregateQuotes(quotes1h),
      aggregateQuotes(quotes1d),
      aggregateQuotes(quotes1w),
      aggregateQuotes(quotes1mo),
    ];

    // const aggregatedQuotes1h = getAggregatedPriceAndVolume(quotes1h);
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
    let [quotes1d, allTokenSpot] = await Promise.all([
      dexIndexer.getQuotes1D(tokenAddress, tokenId),
      dexIndexer.getAllTokenSpot(),
    ]);

    quotes1d = modifyQuotes(quotes1d[0].quotes, allTokenSpot, "1d");
    quotes1d = aggregateQuotes(quotes1d);

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
      const xtzUsdHistory = await tzkt.getXtzUsdHistory();
      const [
        allTokenMetadata,
        allTokenSpot,
        allTokenPool,
        allQuotes1D,
        allSpot1D,
        allSpot1W,
        allSpot1Mo,
      ] = await Promise.all([
        dexIndexer.getAllTokens(),
        dexIndexer.getAllTokenSpot(),
        dexIndexer.getAllTokenPools(),
        dexIndexer.getAllQuotes1D(),
        dexIndexer.getSpot1D(),
        dexIndexer.getSpot1W(),
        dexIndexer.getSpot1MO(),
      ]);

      const tokenObjkt = {};

      const updatedIndexerTokens = {};

      for (let index = 0; index < allTokenMetadata.length; index++) {
        let el = allTokenMetadata[index];
        el.tokenId = el.tokenId || 0;
        el.id = el.tokenAddress + "_" + el.tokenId;

        el = utils.convertObjSnakeToCamel(el);

        updatedIndexerTokens[el.id] = el;
      }

      for (let outerIndex = 0; outerIndex < allTokenSpot.length; outerIndex++) {
        const element = allTokenSpot[outerIndex];
        element.id = element.tokenAddress + "_" + element.tokenId;
        const tokenMetadata = updatedIndexerTokens[element.id];

        /**
     *Calculate aggregated price 
     weighted on tvl from Plenty, Spicy and Quipu
      */
        let totalReserves = 0;
        let aggregatedClose = 0;
        let close = 0;

        for (const quoteData of element.quotes) {
          const foundPool = allTokenPool.find(
            (el) =>
              quoteData.pool.poolId === el.poolId &&
              quoteData.pool.dex.address === el.dex.address &&
              quoteData.pool.dex.type === el.dex.type
          );
          const foundToken = foundPool.tokens.find(
            (el) =>
              element.tokenAddress === el.token.tokenAddress &&
              element.tokenId === el.token.tokenId
          );
          const reserves = parseFloat(foundToken.reserves);

          let quoteToken;
          let quoteTokenPriceInTez;
          let quoteTokenPriceInWTZ;
          // Token has quote paired with xtz
          if (quoteData.token.tokenAddress === "tez") {
            close = quoteData.quote;
          }
          // Token has quote paired with other tokens
          else {
            quoteToken = allTokenSpot.find(
              (el) =>
                quoteData.token.tokenAddress === el.tokenAddress &&
                quoteData.token.tokenId === el.tokenId
            );
            quoteTokenPriceInTez = quoteToken?.quotes.find(
              (el) => el.token.tokenAddress === "tez"
            )?.quote;
            quoteTokenPriceInWTZ = quoteToken?.quotes.find(
              (el) =>
                el.token.tokenAddress === "KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn"
            )?.quote;
            close = isNaN(quoteTokenPriceInTez)
              ? quoteData.quote * quoteTokenPriceInWTZ
              : quoteData.quote * quoteTokenPriceInTez;
          }

          // NaN and Alien dex type error
          if (isNaN(close) || quoteData.pool.dex.type === "alien") {
            continue;
          }

          totalReserves += reserves;
          aggregatedClose += reserves * close;
        }

        element.aggregatedPrice = aggregatedClose / totalReserves;

        const tokenQuote1D = allQuotes1D.find(
          (ele) =>
            ele.tokenAddress === element.tokenAddress &&
            ele.tokenId === element.tokenId
        ).quotes;

        const tokenSpot1D = allSpot1D.find(
          (ele) =>
            ele.tokenAddress === element.tokenAddress &&
            ele.tokenId === element.tokenId
        )?.quotes;
        const tokenSpot1W = allSpot1W.find(
          (ele) =>
            ele.tokenAddress === element.tokenAddress &&
            ele.tokenId === element.tokenId
        )?.quotes;
        const tokenSpot1Mo = allSpot1Mo.find(
          (ele) =>
            ele.tokenAddress === element.tokenAddress &&
            ele.tokenId === element.tokenId
        )?.quotes;

        element.dayClose = getAggregatedOpen(tokenSpot1D, allTokenSpot);
        element.weekClose = getAggregatedOpen(tokenSpot1W, allTokenSpot);
        element.monthClose = getAggregatedOpen(tokenSpot1Mo, allTokenSpot);
        
        if(element.tokenAddress === "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn") {
          console.log(tokenSpot1D);
          console.log(element.dayClose)
        }

        const timeUsdValueDay1 = binarySearch(xtzUsdHistory, day1);
        const timeUsdValueDay7 = binarySearch(xtzUsdHistory, day7);
        const timeUsdValueDay30 = binarySearch(xtzUsdHistory, day30);

        element.dayCloseUsd = element.dayClose * timeUsdValueDay1;
        element.weekCloseUsd = element.weekClose * timeUsdValueDay7;
        element.monthCloseUsd = element.monthClose * timeUsdValueDay30;

        let volume24Xtz = 0;
        let tokenTvl = 0;
        let tokenTvlUsd = 0;

        // Assign exchanges property to pools
        const tokenPools = allTokenPool.filter((el) => {
          // Check if either of the two tokens in the "tokens" field matches the criteria
          const tokenMatches = el.tokens.some((token) => {
            return (
              token.token.tokenAddress === element.tokenAddress &&
              token.token.tokenId === element.tokenId
            );
          });
          // Return true if either token matches the criteria
          return tokenMatches;
        });

        // Create a deep copy of tokenPools (avoid same reference between 2 elements)
        const deepCopyOfTokenPools = _.cloneDeep(tokenPools);

        // Assign it to element.exchanges
        element.exchanges = deepCopyOfTokenPools;

        element.exchanges.forEach((e, index) => {
          // Calculate exchanges infor
          const pool1D = tokenQuote1D.find(
            (ele) =>
              ele.pool.poolId === e.poolId &&
              ele.pool.dex.address === e.dex.address &&
              ele.pool.dex.type === e.dex.type
          );
          let volume;
          let midPrice;
          let quoteToken;
          let quoteTokenPriceInTez;
          let quoteTokenPriceInWTZ;
          if (pool1D) {
            quoteToken = allTokenSpot.find(
              (el) =>
                pool1D.token.tokenAddress === el.tokenAddress &&
                pool1D.token.tokenId === el.tokenId
            );
            quoteTokenPriceInTez = quoteToken?.quotes.find(
              (el) => el.token.tokenAddress === "tez"
            )?.quote;
            quoteTokenPriceInWTZ = quoteToken?.quotes.find(
              (el) =>
                el.token.tokenAddress === "KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn"
            )?.quote;
            volume =
              pool1D.token.tokenAddress === "tez"
                ? pool1D.buckets[0].quoteVolume
                : isNaN(quoteTokenPriceInTez)
                ? pool1D.buckets[0].quoteVolume * quoteTokenPriceInWTZ
                : pool1D.buckets[0].quoteVolume * quoteTokenPriceInTez;
            midPrice =
              pool1D.token.tokenAddress === "tez"
                ? pool1D.buckets[0].close
                : isNaN(quoteTokenPriceInTez)
                ? pool1D.buckets[0].close * quoteTokenPriceInWTZ
                : pool1D.buckets[0].close * quoteTokenPriceInTez;
          }

          // Assign name and 24h volume for each exchange
          e.name = e.dex.type;
          e.midPrice = midPrice || 0;
          e.volume24 = new BigNumber(volume || 0);
          // Calculate total volume 24h in xtz
          volume24Xtz = new BigNumber(volume24Xtz).plus(e.volume24).toNumber();
        });

        /**
         *Calculate tvl for each exchange
         */
        element.exchanges.forEach((e, index) => {
          const token = e.tokens.find(
            (ele) =>
              ele.token.tokenAddress === element.tokenAddress &&
              ele.token.tokenId === element.tokenId
          );

          let tokenReserves = 0;
          if (e.dex.type === "alien") {
            tokenReserves =
              token.reserves /
              (ALIEN_FEE_DENOMINATOR * Math.pow(10, token.token.decimals));
          } else {
            tokenReserves = token.reserves / Math.pow(10, token.token.decimals);
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

  async calculateTokenData(element, tokenFeed, xtzUsd) {
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
        const quoteToken = element.exchanges[index].tokens.find(
          (ele) =>
            ele.token.tokenAddress !== element.tokenAddress ||
            ele.token.tokenId !== element.tokenId
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
