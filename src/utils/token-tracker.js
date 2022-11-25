import axios from "axios";
import BigNumber from "bignumber.js";
import { getPrice } from "./home-wallet";
import ipfs from "./ipfs";
import teztools from "./teztools";

const filterQueryBytokenId = (tokenPriceRange, tokenAddress, tokenId) => {
  const value = tokenPriceRange?.filter(
    (val) => val.tokenId === `${tokenAddress}_${tokenId || 0}`
  );

  return value.length > 0 ? value[0] : { high: 0, low: 0 };
};

export default {
  async getQuotes() {
    const query = `
    query MyQuery {
      quotesTotal(distinct_on: tokenId) {
        high
        low
        tokenId
      }
      quotes1dNogaps(distinct_on: tokenId) {
        volume
        tokenId
      }
    }

    `;
    const {
      data: {
        data: { quotesTotal, quotes1dNogaps },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", { query });

    return { quotesTotal, quotes1dNogaps };
  },
  async getQuotes15mNogaps(tokenId, startTime) {
    const query = `
    query MyQuery($tokenId: String, $startTime: timestamptz) {
      quotes15mNogaps(
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
        data: { quotes15mNogaps },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId, startTime: startTime },
    });
    return quotes15mNogaps;
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

  async getTokens() {
    const { contracts: tokens } = await teztools.getPricefeed();

    return { ...tokens };
  },

  async calculateTokenData(
    token,
    priceFeed,
    xtzUsd,
    tokenHighAndLow,
    tokenVolumes
  ) {
    const tokenPrice = await getPrice(
      token.tokenAddress,
      token.tokenId?.toString(),
      priceFeed
    );

    const tokenPriceRange = filterQueryBytokenId(
      tokenHighAndLow,
      token.tokenAddress,
      token.tokenId?.toString()
    );

    const tokenVolume = filterQueryBytokenId(
      tokenVolumes,
      token.tokenAddress,
      token.tokenId?.toString()
    );
    const element = tokenPrice;

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
      element.volume1Day = Number(tokenVolume.volume) || 0;
      // element.volume1DayChange = await getVolumeChange(historyPrice);
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
