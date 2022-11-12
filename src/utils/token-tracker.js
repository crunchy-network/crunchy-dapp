import axios from "axios";
import BigNumber from "bignumber.js";
import ipfs from "./ipfs";
import teztools from "./teztools";

const TIME_INTERVAL = {
  ONE_DAY : 1,
  SEVEN_DAY : 7,
  THIRY_DAY : 30,
}

const MILISECOND_ONE_DAY = 86400000;

const diffInDay = (timestamp_1, timestamp_2) => {
  return (timestamp_1 - timestamp_2) / MILISECOND_ONE_DAY;
}
const getTokenPriceInterval = async(historyPrice, timeInterval) => {
  const tokenPriceInterval = [];

  let index = 0;
  let historyTimestamp = new Date(historyPrice[index].timestamp);
  let currentTimestamp = new Date();

  // Get the index which satify time interval
  while( diffInDay(currentTimestamp, historyTimestamp) <= timeInterval) {
    if( historyPrice[index].t1price && 
        historyPrice[index].t1volume && 
        historyPrice[index].t1pool && 
        historyPrice[index].lptsupply) {
      const priceObj = {
        "price": historyPrice[index]?.t1price,
        "timestamp": historyPrice[index]?.timestamp,
        "volume": historyPrice[index]?.t1volume,
        "pool": historyPrice[index]?.t1pool,
        "lptsupply": historyPrice[index]?.lptsupply,
      }
      tokenPriceInterval.push(priceObj);
    }
    historyTimestamp = new Date(historyPrice[++index].timestamp);
  }
  return tokenPriceInterval;
}
const getVolume = async(historyPrice, timeInterval) => {
  let totalVolume = 0;

  let index = 0;
  let historyTimestamp = new Date(historyPrice[index].timestamp);
  let currentTimestamp = new Date();

  // Get the index which satify time interval
  while( diffInDay(currentTimestamp, historyTimestamp) <= timeInterval) {
    const volume = historyPrice[index].t1volume ? historyPrice[index].t1volume : 0;
    const volume_in_usd = (volume !== 0) ? volume * historyPrice[index].t1price : 0;
    totalVolume += volume_in_usd
    historyTimestamp = new Date(historyPrice[++index].timestamp)
  }
  return totalVolume;
}
export default {
  async getTokens() {
    const { contracts: tokens } = await teztools.getPricefeed();
    
    return { ...tokens };
  },

  async calculateTokenData(token) {
    const element = token;

    if (element.thumbnailUri)
      element.thumbnailUri = ipfs.transformUri(element.thumbnailUri);

    const {
      data: [tokenInfo],
    } = await axios(
      `https://api.tzkt.io/v1/tokens?contract=${element.tokenAddress}`
    );
    const historyPrice = await teztools.getPriceHistory(element.tokenAddress, element.tokenId);
    if (tokenInfo) {
      const currentPrice = element?.currentPrice || false;
      const price = new BigNumber(currentPrice);

      const pricePair = element?.pairs.find(
        (el) => el.dex === "Quipuswap" && el.sides[1].symbol === "XTZ"
      );

      const mktCap = new BigNumber(tokenInfo.totalSupply)
        .div(new BigNumber(10).pow(element.decimals))
        .times(element.usdValue);

      const change1Day = price
        .minus(pricePair?.sides[0]?.dayClose)
        .div(pricePair?.sides[0]?.dayClose)
        .times(100)
        .toNumber();
      const change7Day = price
        .minus(pricePair?.sides[0]?.weekClose)
        .div(pricePair?.sides[0]?.weekClose)
        .times(100)
        .toNumber();
      const change30Day = price
        .minus(pricePair?.sides[0]?.monthClose)
        .div(pricePair?.sides[0]?.monthClose)
        .times(100)
        .toNumber();
      
      element.mktCap = isNaN(mktCap.toNumber()) ? 0 : mktCap.toNumber();
      element.change1Day = change1Day;
      element.change7Day = change7Day;
      element.change30Day = change30Day;
      element.volume24 = await getVolume(historyPrice, TIME_INTERVAL.ONE_DAY);
      element.volume7Day = await getVolume(historyPrice, TIME_INTERVAL.SEVEN_DAY);
      element.volume30Day = await getVolume(historyPrice, TIME_INTERVAL.THIRY_DAY);
      element.price1Day = await getTokenPriceInterval(historyPrice, TIME_INTERVAL.ONE_DAY);
      element.price7Day = await getTokenPriceInterval(historyPrice , TIME_INTERVAL.SEVEN_DAY);
      element.price30Day = await getTokenPriceInterval(historyPrice , TIME_INTERVAL.THIRY_DAY);
      return element;
    } else {
      return false;
    }
  },
};