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
const oneMonthAndOneDayInMiliSecond = oneDayInMiliSecond * 31;
const twoMonthInMiliSecond = oneDayInMiliSecond * 60;
const sixMonthInMiliSecond = oneDayInMiliSecond * 180;
const oneYearInMiliSecond = oneDayInMiliSecond * 360;
const oneDayAgo = new Date(Date.now() - oneDayInMiliSecond).toISOString();
const oneWeekAgo = new Date(Date.now() - oneWeekInMiliSecond).toISOString();
const oneMonthAgo = new Date(Date.now() - oneMonthInMiliSecond).toISOString();
const oneMonthAndOneDayAgo = new Date(
  Date.now() - oneMonthAndOneDayInMiliSecond
).toISOString();
const twoMonthAgo = new Date(Date.now() - twoMonthInMiliSecond).toISOString();
const sixMonthAgo = new Date(Date.now() - sixMonthInMiliSecond).toISOString();
const oneYearAgo = new Date(Date.now() - oneYearInMiliSecond).toISOString();
const TEZ_AND_WRAPPED_TEZ_ADDRESSES = [
  "tez",
  "KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b",
  "KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn",
];

const TOO_FEW_TVL_POOL_ADDRESSES = ["KT1FDyQgVeU7pwJ3wKcEQbxp6PzQZgcumZxz"];
const VOLATILE_PRICE_POOL = ["KT1VSK3ZFRKfzPhqE5yPszsdfkMwp2Z95SXb"];

function findPoolPairedWithTez(quotes) {
  let poolPriceInTez = 0;
  if (!quotes) {
    return 0;
  }
  for (const address of TEZ_AND_WRAPPED_TEZ_ADDRESSES) {
    const quote = quotes.find(
      (el) =>
        el.token.tokenAddress === address &&
        !TOO_FEW_TVL_POOL_ADDRESSES.includes(el.pool.dex.address)
    );
    if (quote) {
      poolPriceInTez = quote.quote;
      break;
    }
  }
  return poolPriceInTez;
}
function getQuoteTokenPriceInTez(allTokenQuotes, allTokenSpot, pool) {
  let quoteTokenPriceInTez = 0;
  const quoteToken = allTokenQuotes.find(
    (el) =>
      pool.token.tokenAddress === el.tokenAddress &&
      pool.token.tokenId === el.tokenId
  );
  quoteTokenPriceInTez = findPoolPairedWithTez(quoteToken?.quotes);

  // Quote token does not pair with tez
  if (quoteToken && !quoteTokenPriceInTez) {
    for (const pool of quoteToken?.quotes) {
      const token = allTokenSpot.find(
        (el) =>
          pool.token.tokenAddress === el.tokenAddress &&
          pool.token.tokenId === el.tokenId
      );
      const tokenQuote = pool?.quote;
      const tokenQuoteInTez = findPoolPairedWithTez(token?.quotes);
      if (tokenQuoteInTez) {
        quoteTokenPriceInTez = tokenQuote * tokenQuoteInTez;
        break;
      }
    }
  }
  return quoteTokenPriceInTez;
}
function getMktCapAndVolume(allTokenPriceAndVol, type) {
  const currentDate = new Date();
  let currentDateIterator;
  let offsetIterator;
  const result = [];

  if (type === "1d") {
    currentDateIterator = new Date(oneMonthAgo);
  } else if (type === "1w") {
    currentDateIterator = new Date(allTokenPriceAndVol[0]?.quotes[0]?.bucket);
  } else {
    currentDateIterator = new Date(allTokenPriceAndVol[0]?.quotes[0]?.bucket);
  }

  // Set the time components to zero
  currentDateIterator.setUTCHours(0);
  currentDateIterator.setUTCMinutes(0);
  currentDateIterator.setUTCSeconds(0);
  currentDateIterator.setUTCMilliseconds(0);

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDateIterator <= currentDate) {
    let mktCap = 0;
    let totalVol = 0;

    allTokenPriceAndVol.forEach((token) => {
      const tokenQuoteAtDate = findElementWithSameDate(
        token.quotes,
        currentDateIterator
      );

      let tokenQuoteClosestToDate;
      if (!tokenQuoteAtDate) {
        tokenQuoteClosestToDate = findClosestElementToDate(
          token.quotes,
          currentDateIterator
        );
      }

      const tokenCalcSupply = new BigNumber(token.totalSupply)
        .div(new BigNumber(10).pow(token.decimals))
        .toNumber();
      const tokenMktCap = tokenQuoteAtDate
        ? new BigNumber(tokenCalcSupply)
            .times(tokenQuoteAtDate.aggregatedClose)
            .toNumber()
        : tokenQuoteClosestToDate
        ? new BigNumber(tokenCalcSupply)
            .times(tokenQuoteClosestToDate.aggregatedClose)
            .toNumber()
        : 0;
      const tokenVol = tokenQuoteAtDate
        ? tokenQuoteAtDate.aggregatedXtzVolume
        : 0;

      mktCap += tokenMktCap;
      totalVol += tokenVol;
    });

    result.push({
      bucket: currentDateIterator.toISOString(),
      mktCap,
      totalVol,
    });

    // Increment the iterator by one day
    if (type === "1d") {
      offsetIterator = 1;
      currentDateIterator.setDate(
        currentDateIterator.getDate() + offsetIterator
      );
    } else if (type === "1w") {
      offsetIterator = 7;
      currentDateIterator.setDate(
        currentDateIterator.getDate() + offsetIterator
      );
    } else {
      offsetIterator = 1;
      currentDateIterator.setUTCMonth(
        currentDateIterator.getUTCMonth() + offsetIterator
      );
    }
  }

  return result;
}

function aggregateQuotes(quotes) {
  let modifiedQuotes = [];
  quotes.forEach((quote, index) => {
    modifiedQuotes.push(quote.buckets);
  });
  modifiedQuotes = [].concat(...modifiedQuotes);
  return modifiedQuotes;
}

function modifyQuotes(quotes, allTokenQuotes, type) {
  let quoteToken;
  let quoteTokenPriceInTez;
  quotes.forEach((quote, index) => {
    quoteToken = allTokenQuotes.find(
      (el) =>
        quote.token.tokenAddress === el.tokenAddress &&
        quote.token.tokenId === el.tokenId
    );
    quoteTokenPriceInTez = quoteToken?.quotes.find(
      (el) =>
        TEZ_AND_WRAPPED_TEZ_ADDRESSES.includes(el.token.tokenAddress) &&
        !TOO_FEW_TVL_POOL_ADDRESSES.includes(el.pool.dex.address)
    )?.buckets[0].close;
    // Only get element from one month for 1h chart
    if (type === "1h") {
      quote.buckets = quote.buckets.filter(
        (bucket) => new Date(bucket.bucket) > new Date(oneMonthAgo)
      );
    }
    // Only get element from two months for 1d chart
    if (type === "1d") {
      quote.buckets = quote.buckets.filter(
        (bucket) => new Date(bucket.bucket) > new Date(twoMonthAgo)
      );
    }
    quote.buckets.map((bucket) => {
      bucket.dex_type = quote?.pool?.dex.type;
      bucket.quote_token_address = quote.token.tokenAddress;
      bucket.quote_token_id = quote.token.tokenId;
      bucket.close_xtz = TEZ_AND_WRAPPED_TEZ_ADDRESSES.includes(
        quote.token.tokenAddress
      )
        ? Number(bucket.close)
        : Number(bucket.close) * Number(quoteTokenPriceInTez);
      bucket.volume_quote_xtz = TEZ_AND_WRAPPED_TEZ_ADDRESSES.includes(
        quote.token.tokenAddress
      )
        ? Number(bucket.quoteVolume)
        : Number(bucket.quoteVolume) * Number(quoteTokenPriceInTez);
    });
  });
  return quotes;
}

function getAggregatedOpen(
  quotes,
  allTokenQuotes,
  highestTvlPairedToken,
  type
) {
  if (!quotes) {
    return 0;
  }

  let currentDateIterator;
  if (type === "1d") {
    currentDateIterator = new Date(oneDayAgo);
  } else if (type === "1w") {
    currentDateIterator = new Date(oneWeekAgo);
  } else {
    currentDateIterator = new Date(oneMonthAgo);
  }
  const token = quotes.find(
    (quote) =>
      quote.token.tokenAddress === highestTvlPairedToken.token.tokenAddress &&
      quote.token.tokenId === highestTvlPairedToken.token.tokenId
  );

  const quoteToken = allTokenQuotes.find(
    (el) =>
      token?.token.tokenAddress === el.tokenAddress &&
      token?.token.tokenId === el.tokenId
  );

  let quoteTokenPriceInTez;
  for (const address of TEZ_AND_WRAPPED_TEZ_ADDRESSES) {
    const quote = quoteToken?.quotes.find(
      (el) =>
        el.token.tokenAddress === address &&
        new Date(el.buckets[0].bucket) >= currentDateIterator &&
        !TOO_FEW_TVL_POOL_ADDRESSES.includes(el.pool.dex.address)
    );
    if (quote) {
      quoteTokenPriceInTez = quote?.buckets[0].open;
      break;
    }
  }

  return TEZ_AND_WRAPPED_TEZ_ADDRESSES.includes(token?.token.tokenAddress)
    ? Number(token?.quote)
    : Number(token?.quote) * Number(quoteTokenPriceInTez);
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
  if (!Array.isArray(array) || array.length === 0) {
    return null; // Return null for an empty or non-array input
  }

  return array.find((element) => {
    const date = element.bucket;
    return sameDay(new Date(date), new Date(targetDate));
  });
}

function findClosestElementToDate(array, targetDate) {
  if (!Array.isArray(array) || array.length === 0) {
    return null; // Return null for an empty or non-array input
  }

  // Calculate the initial minimum time difference and initialize the closest element
  let minTimeDifference = Math.abs(targetDate - new Date(array[0].bucket));
  let closestElement = array[0];

  // Iterate through the array to find the closest element
  array.forEach((element) => {
    const elementDate = new Date(element.bucket);
    const timeDifference = Math.abs(targetDate - elementDate);

    if (timeDifference < minTimeDifference) {
      // Update the closest element if a closer one is found
      minTimeDifference = timeDifference;
      closestElement = element;
    }
  });

  return closestElement;
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

        quote.aggregatedClose = aggregatedXtzVolume
          ? weightedCloseSum / aggregatedXtzVolume
          : quote.close_xtz;
        quote.aggregatedXtzVolume = quote.volume_quote_xtz;
        aggregatedQuotes.push(quote);
      }
    }
  }
  return aggregatedQuotes;
}

export default {
  async getPriceAndVolumeQuotes(tokenAddress, tokenId) {
    let [
      quotes1h,
      quotes1d,
      quotes1w,
      quotes1mo,
      allQuotes1D,
      allQuotes1W,
      allQuotes1Mo,
    ] = await Promise.all([
      dexIndexer.getQuotes1H(tokenAddress, tokenId),
      dexIndexer.getQuotes1D(tokenAddress, tokenId),
      dexIndexer.getQuotes1W(tokenAddress, tokenId),
      dexIndexer.getQuotes1MO(tokenAddress, tokenId),
      dexIndexer.getAllQuotes1D(),
      dexIndexer.getAllQuotes1W(),
      dexIndexer.getAllQuotes1MO(),
    ]);

    [quotes1h, quotes1d, quotes1w, quotes1mo] = [
      modifyQuotes(quotes1h[0].quotes, allQuotes1D, "1h"),
      modifyQuotes(quotes1d[0].quotes, allQuotes1D, "1d"),
      modifyQuotes(quotes1w[0].quotes, allQuotes1W),
      modifyQuotes(quotes1mo[0].quotes, allQuotes1Mo),
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

  async getOverviewChartData(tokenFeed) {
    let [
      allPriceAndVol1D,
      allPriceAndVol1W,
      allPriceAndVol1Mo,
      allQuotes1D,
      allQuotes1W,
      allQuotes1Mo,
    ] = await Promise.all([
      dexIndexer.getAggregatedPriceAndVolume1D(oneMonthAndOneDayAgo),
      dexIndexer.getAggregatedPriceAndVolume1W(sixMonthAgo),
      dexIndexer.getAggregatedPriceAndVolume1MO(oneYearAgo),
      dexIndexer.getAllQuotes1D(),
      dexIndexer.getAllQuotes1W(),
      dexIndexer.getAllQuotes1MO(),
    ]);

    // Only get ranked token
    allPriceAndVol1D = allPriceAndVol1D.filter((token) => {
      const tokenFound = tokenFeed.find(
        (el) =>
          el.tokenAddress === token.tokenAddress && el.tokenId === token.tokenId
      );
      return !!tokenFound && tokenFound.tokenTvl >= 5000;
    });

    allPriceAndVol1W = allPriceAndVol1W.filter((token) => {
      const tokenFound = tokenFeed.find(
        (el) =>
          el.tokenAddress === token.tokenAddress && el.tokenId === token.tokenId
      );
      return !!tokenFound && tokenFound.tokenTvl >= 5000;
    });

    allPriceAndVol1Mo = allPriceAndVol1Mo.filter((token) => {
      const tokenFound = tokenFeed.find(
        (el) =>
          el.tokenAddress === token.tokenAddress && el.tokenId === token.tokenId
      );
      return !!tokenFound && tokenFound.tokenTvl >= 5000;
    });

    // Modify price and volume quotes
    allPriceAndVol1D.forEach((token) => {
      token.quotes = modifyQuotes(token.quotes, allQuotes1D, "1d");
    });

    allPriceAndVol1W.forEach((token) => {
      token.quotes = modifyQuotes(token.quotes, allQuotes1W);
    });

    allPriceAndVol1Mo.forEach((token) => {
      token.quotes = modifyQuotes(token.quotes, allQuotes1Mo);
    });

    // Aggregate price and volume quotes
    allPriceAndVol1D.forEach((token) => {
      token.quotes = aggregateQuotes(token.quotes);
    });

    allPriceAndVol1W.forEach((token) => {
      token.quotes = aggregateQuotes(token.quotes);
    });

    allPriceAndVol1Mo.forEach((token) => {
      token.quotes = aggregateQuotes(token.quotes);
    });

    // Get aggregated price and volume
    allPriceAndVol1D.forEach((token) => {
      token.quotes = getAggregatedPriceAndVolume(token.quotes);
    });

    allPriceAndVol1W.forEach((token) => {
      token.quotes = getAggregatedPriceAndVolume(token.quotes);
    });

    allPriceAndVol1Mo.forEach((token) => {
      token.quotes = getAggregatedPriceAndVolume(token.quotes);
    });
    // Get market cap and total volume
    const mktCapAndVol1D = getMktCapAndVolume(allPriceAndVol1D, "1d");
    const mktCapAndVol1W = getMktCapAndVolume(allPriceAndVol1W, "1w");
    const mktCapAndVol1Mo = getMktCapAndVolume(allPriceAndVol1Mo, "1m");

    return {
      mktCapAndVol1D,
      mktCapAndVol1W,
      mktCapAndVol1Mo,
    };
  },

  async getAllQuotes1d(tokenAddress, tokenId) {
    let [quotes1d, allQuotes1D] = await Promise.all([
      dexIndexer.getQuotes1D(tokenAddress, tokenId),
      dexIndexer.getAllQuotes1D(),
    ]);

    quotes1d = modifyQuotes(quotes1d[0].quotes, allQuotes1D, "1d");
    quotes1d = aggregateQuotes(quotes1d);

    const aggregatedQuotes1d = getAggregatedPriceAndVolume(quotes1d);
    return aggregatedQuotes1d;
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
        allQuotes1W,
        allQuotes1Mo,
        allSpot1D,
        allSpot1W,
        allSpot1Mo,
      ] = await Promise.all([
        dexIndexer.getAllTokens(),
        dexIndexer.getAllTokenSpot(),
        dexIndexer.getAllTokenPools(),
        dexIndexer.getAllQuotes1D(),
        dexIndexer.getAllQuotes1W(),
        dexIndexer.getAllQuotes1MO(),
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
          // Exclude aggregated price calculation from volatile pool
          if(VOLATILE_PRICE_POOL.includes(quoteData.pool.dex.address)) {
            continue;
          }

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

          const quoteTokenPriceInTez = getQuoteTokenPriceInTez(
            allTokenSpot,
            allTokenSpot,
            quoteData
          );
          close = TEZ_AND_WRAPPED_TEZ_ADDRESSES.includes(
            quoteData.token.tokenAddress
          )
            ? Number(quoteData.quote)
            : Number(quoteData.quote) * Number(quoteTokenPriceInTez);

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
        )?.quotes;

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
          const pool1D = tokenQuote1D?.find(
            (ele) =>
              ele.pool.poolId === e.poolId &&
              ele.pool.dex.address === e.dex.address &&
              ele.pool.dex.type === e.dex.type
          );
          let volume;
          let midPrice;
          let quoteTokenPriceInTez;

          if (pool1D) {
            quoteTokenPriceInTez = getQuoteTokenPriceInTez(
              allTokenSpot,
              allTokenSpot,
              pool1D
            );

            // Get the price for quote
            midPrice = TEZ_AND_WRAPPED_TEZ_ADDRESSES.includes(
              pool1D.token.tokenAddress
            )
              ? pool1D.buckets[0].close
              : pool1D.buckets[0].close * quoteTokenPriceInTez;

            const dateChecker = new Date(oneDayAgo);
            // Set the time components to zero
            dateChecker.setUTCHours(0);
            dateChecker.setUTCMinutes(0);
            dateChecker.setUTCSeconds(0);
            dateChecker.setUTCMilliseconds(0);
            if (new Date(pool1D.buckets[0].bucket) >= dateChecker) {
              volume = TEZ_AND_WRAPPED_TEZ_ADDRESSES.includes(
                pool1D.token.tokenAddress
              )
                ? pool1D.buckets[0].quoteVolume
                : pool1D.buckets[0].quoteVolume * quoteTokenPriceInTez;
            }
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
          // Push the exchange with too few tvl to the list
          if (element.exchanges[index].tokenTvl < 5) {
            TOO_FEW_TVL_POOL_ADDRESSES.push(
              element.exchanges[index].dex.address
            );
          }
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
        let highestTvlExchange;
        let highestTvl = 0;
        // Iterate through the elements in the exchanges
        for (const exchange of element.exchanges) {
          const tvl = parseFloat(exchange.tokenTvl);
          // Check if this element has a higher TVL than the current highest
          if (tvl >= highestTvl) {
            highestTvl = tvl;
            highestTvlExchange = exchange;
          }
        }

        const highestTvlPairedToken = highestTvlExchange.tokens.find(
          (token) =>
            token.token.tokenAddress !== element.tokenAddress ||
            token.token.tokenId !== element.tokenId
        );

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

        element.dayClose = getAggregatedOpen(
          tokenSpot1D,
          allQuotes1D,
          highestTvlPairedToken,
          "1d"
        );
        element.weekClose = getAggregatedOpen(
          tokenSpot1W,
          allQuotes1W,
          highestTvlPairedToken,
          "1w"
        );
        element.monthClose = getAggregatedOpen(
          tokenSpot1Mo,
          allQuotes1Mo,
          highestTvlPairedToken,
          "1m"
        );

        const timeUsdValueDay1 = binarySearch(xtzUsdHistory, day1);
        const timeUsdValueDay7 = binarySearch(xtzUsdHistory, day7);
        const timeUsdValueDay30 = binarySearch(xtzUsdHistory, day30);

        element.dayCloseUsd = element.dayClose * timeUsdValueDay1;
        element.weekCloseUsd = element.weekClose * timeUsdValueDay7;
        element.monthCloseUsd = element.monthClose * timeUsdValueDay30;

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
