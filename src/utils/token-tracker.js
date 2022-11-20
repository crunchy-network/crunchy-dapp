import axios from "axios";
import BigNumber from "bignumber.js";
import { getPrice } from "./home-wallet";
import ipfs from "./ipfs";
import teztools from "./teztools";

const TIME_INTERVAL = {
  ONE_DAY: 1,
  SEVEN_DAY: 7,
  THIRTY_DAY: 30,
};

const MILISECOND_ONE_DAY = 86400000;

const diffInDay = (timestamp1, timestamp2) => {
  return (timestamp1 - timestamp2) / MILISECOND_ONE_DAY;
};

const getTokenPriceInterval = async (historyPrice, timeInterval) => {
  const tokenPriceInterval = [];

  let index = 0;
  let historyTimestamp = new Date(historyPrice[index].timestamp);
  const currentTimestamp = new Date();

  // Get the index which satify time interval
  while (diffInDay(currentTimestamp, historyTimestamp) <= timeInterval) {
    if (
      historyPrice[index].t1price &&
      historyPrice[index].t1volume &&
      historyPrice[index].t1pool &&
      historyPrice[index].lptsupply
    ) {
      const priceObj = {
        price: historyPrice[index]?.t1price,
        timestamp: historyPrice[index]?.timestamp,
        volume: historyPrice[index]?.t1volume,
        pool: historyPrice[index]?.t1pool,
        lptsupply: historyPrice[index]?.lptsupply,
      };
      tokenPriceInterval.push(priceObj);
    }
    index += 1;
    // eslint-disable-next-line no-prototype-builtins
    if (!historyPrice[index].hasOwnProperty("timestamp")) {
      break;
    }
    historyTimestamp = new Date(historyPrice[index].timestamp);
  }
  return tokenPriceInterval;
};

const getVolume = async (historyPrice, timeInterval) => {
  let totalVolume = 0;

  let index = 0;
  let historyTimestamp = new Date(historyPrice[index].timestamp);
  const currentTimestamp = new Date();

  // Get the index which satify time interval
  while (diffInDay(currentTimestamp, historyTimestamp) <= timeInterval) {
    const volume = historyPrice[index].t1volume
      ? historyPrice[index].t1volume
      : 0;
    const volumeInUsd = volume !== 0 ? volume * historyPrice[index].t1price : 0;
    totalVolume += volumeInUsd;
    historyTimestamp = new Date(historyPrice[++index].timestamp);
  }
  return totalVolume;
};

const getVolumeChange = async (historyPrice) => {
  let todayVolume = 0;
  let yesterdayVolume = 0;
  const todayTimestamp = new Date().now - 24 * 60 * 60 * 1000;
  const yesterdayTimestamp = new Date().now - 48 * 60 * 60 * 1000;

  for (let index = 0; index < historyPrice.length; index++) {
    const element = historyPrice[index];
    if (new Date(element.timestamp) >= new Date(todayTimestamp)) {
      todayVolume += element.t1volume;
    }

    if (
      new Date(element.timestamp) >= new Date(yesterdayTimestamp) &&
      new Date(element.timestamp) < new Date(todayTimestamp)
    ) {
      yesterdayVolume += element.t1volume;
    }
  }

  return todayVolume / yesterdayVolume - 1;
};

const filterTokenHighAndLow = (tokenPriceRange, tokenAddress, tokenId) => {
  const value = tokenPriceRange?.filter(
    (val) => val.tokenId === `${tokenAddress}_${tokenId || 0}`
  );

  return value.length > 0 ? value[0] : { high: 0, low: 0 };
};

export default {
  async getTokenHighAndLow() {
    const query = `
    query MyQuery {
      quotesTotal(distinct_on: tokenId) {
        high
        low
        tokenId
      }
    }

    `;
    const {
      data: {
        data: { quotesTotal },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", { query });

    return quotesTotal;
  },

  async getTokens() {
    const { contracts: tokens } = await teztools.getPricefeed();

    return { ...tokens };
  },

  async calculateTokenData(token, priceFeed, xtzUsd, tokenHighAndLow) {
    const tokenPrice = await getPrice(
      token.tokenAddress,
      token.tokenId?.toString(),
      priceFeed
    );
    const tokenPriceRange = filterTokenHighAndLow(
      tokenHighAndLow,
      token.tokenAddress,
      token.tokenId?.toString()
    );

    const element = tokenPrice;

    const historyPrice = await teztools.getPriceHistory(
      element.tokenAddress,
      element.tokenId
    );

    if (element) {
      if (element.thumbnailUri)
        element.thumbnailUri = ipfs.transformUri(element.thumbnailUri);

      const currentPrice = element?.currentPrice || false;
      const price = new BigNumber(currentPrice);

      const pricePair = element?.pairs.find(
        (el) => el.dex === "Quipuswap" && el.sides[1].symbol === "XTZ"
      );

      const mktCap = new BigNumber(element.totalSupply)
        .div(new BigNumber(10).pow(element.decimals))
        .times(element.usdValue);

      const calcSupply = new BigNumber(element.totalSupply).div(
        new BigNumber(10).pow(element.decimals)
      );

      const change1Day =
        price
          .minus(pricePair?.sides[0]?.dayClose)
          .div(pricePair?.sides[0]?.dayClose)
          .times(100)
          .toNumber() || 0;
      const change7Day =
        price
          .minus(pricePair?.sides[0]?.weekClose)
          .div(pricePair?.sides[0]?.weekClose)
          .times(100)
          .toNumber() || 0;
      const change30Day =
        price
          .minus(pricePair?.sides[0]?.monthClose)
          .div(pricePair?.sides[0]?.monthClose)
          .times(100)
          .toNumber() || 0;

      element.mktCap = isNaN(mktCap.toNumber()) ? 0 : mktCap.toNumber();
      element.change1Day = change1Day;
      element.change7Day = change7Day;
      element.change30Day = change30Day;
      element.volume1Day = await getVolume(historyPrice, TIME_INTERVAL.ONE_DAY);
      element.volume1DayChange = await getVolumeChange(historyPrice);
      element.volume7Day = await getVolume(
        historyPrice,
        TIME_INTERVAL.SEVEN_DAY
      );
      element.volume30Day = await getVolume(
        historyPrice,
        TIME_INTERVAL.THIRTY_DAY
      );
      element.price1Day = await getTokenPriceInterval(
        historyPrice,
        TIME_INTERVAL.ONE_DAY
      );
      element.price7Day = await getTokenPriceInterval(
        historyPrice,
        TIME_INTERVAL.SEVEN_DAY
      );
      element.price30Day = await getTokenPriceInterval(
        historyPrice,
        TIME_INTERVAL.THIRTY_DAY
      );
      element.calcSupply = calcSupply;

      element.allTimeHigh = Number(tokenPriceRange?.high) || 0;
      element.allTimeLow = Number(tokenPriceRange?.low) || 0;

      for (let index = 0; index < element?.pairs?.length; index++) {
        const market = element?.pairs[index];
        element.pairs[index].lpPrice =
          (market.tvl / market.lptSupply) * xtzUsd || 0;
      }

      if (mktCap < 200000000) return element;
    }
  },
};
