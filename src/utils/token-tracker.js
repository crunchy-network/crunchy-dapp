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
    const day = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const query = `
    query MyQuery {
      quotesTotal(distinct_on: tokenId) {
        high
        low
        tokenId
      }
      quotes1dNogaps(
        where: {bucket: {_gte: "${day}"}}
        distinct_on: tokenId
      ) {
        volume
        tokenId
      }
      statsTotal(distinct_on: tokenId) {
        tokenId
        tvl
      }
    }
    `;
    const {
      data: {
        data: { quotesTotal, quotes1dNogaps, statsTotal },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", { query });

    return { quotesTotal, quotes1dNogaps, totalTvl: statsTotal };
  },
  async getDayBeforeVolume() {
    const day = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const day2 = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const query = `
    query MyQuery {
      quotes1dNogaps(
        where: {bucket: {_gte: "${day2}",  _lt: "${day}"}}
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
                bucket: {_gt: $startTime}}xx
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
    tokenVolumes,
    totalTvl
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
    const tvl =
      filterQueryBytokenId(
        totalTvl,
        token.tokenAddress,
        token.tokenId?.toString()
      ).tvl || 0;

    // const tokenVolume2DaysAgo =
    //   Number(
    //     filterQueryBytokenId(
    //       tokensVolume2DaysAgo,
    //       token.tokenAddress,
    //       token.tokenId?.toString()
    //     ).volume
    //   ) || 0;

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
      element.tokenTvl = tvl;

      // element.volume1DayChange =
      //   ((element.volume1Day - tokenVolume2DaysAgo) / tokenVolume2DaysAgo) *
      //     100 || 0;
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
