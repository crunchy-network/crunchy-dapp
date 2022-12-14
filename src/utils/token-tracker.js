import axios from "axios";
import BigNumber from "bignumber.js";
import { getPrice } from "./home-wallet";
import ipfs from "./ipfs";
import teztools from "./teztools";

const twentyFourHrs = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const fourtyEightHrs = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

async function getExchange24HrsVolume(exchangeId) {
  const query = `
  query MyQuery {
    quotes1dNogaps(
      where: {exchangeId: {_eq: "${exchangeId}"}, bucket: {_gte: "${twentyFourHrs}"}}
    ) {
      exchangeId
      xtzVolume
      bucket
    }
  }
  
  `;

  const {
    data: {
      data: { quotes1dNogaps },
    },
  } = await axios.post("https://dex.dipdup.net/v1/graphql", {
    query,
  });

  return quotes1dNogaps;
}

// const queryTokenPriceBucket = async (tokenId, value, param) => {
//   const query = `
//     query MyQuery {
//       quotes1dNogaps(where: {${param}: {_eq: "${value}"}, tokenId: {_eq: "${tokenId}"}}, distinct_on: ${param}) {
//         bucket
//       }
//     }
//   `;

//   console.log("\n\n------ begin:  ------");
//   console.log("queryTokenPriceBucket", query);
//   console.log("------ end:  ------\n\n");

//   const {
//     data: {
//       data: { quotes1dNogaps },
//     },
//   } = await axios.post("https://dex.dipdup.net/v1/graphql", {
//     query,
//   });

//   return quotes1dNogaps;
// };

// const getTokenPriceBucket = async (tokenId, value, param = "high") => {
//   const query = await queryTokenPriceBucket(tokenId, value, param);

//   if (query.length === 0) {
//     return 0;
//   } else {
//     return query[0].bucket;
//   }
// };

const filterQueryBytokenId = (tokenPriceRange, tokenAddress, tokenId) => {
  const value = tokenPriceRange?.filter(
    (val) => val.tokenId === `${tokenAddress}_${tokenId || 0}`
  );

  return value.length > 0 ? value[0] : { high: 0, low: 0 };
};

async function queryTokenXtzVolume(tokenId) {
  const query = `
  query MyQuery {
    trade(where: {tokenId: {_eq: "${tokenId}"}, timestamp: {_gte: "${twentyFourHrs}"}}) {
      tezQty
      timestamp
      tokenId
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
      quotes1d (
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
      quotes1w(
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
        data: { quotes1d, quotes1w, quotes1mo },
      },
    } = await axios.post("https://dex.dipdup.net/v1/graphql", {
      query,
      variables: { tokenId: tokenId },
    });
    return { quotes1d: quotes1d, quotes1w: quotes1w, quotes1mo };
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
        exchangeId
      }
      stats1mo(where: {tokenId: {_eq: $tokenId }}, distinct_on: bucket) {
        bucket
        tvlUsd
        tokenId
      }
      stats1w(distinct_on: bucket, where: {tokenId: {_eq: $tokenId }}) {
        bucket
        tokenId
        tvlUsd
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

  async getTokens() {
    const { contracts: tokens } = await teztools.getPricefeed();

    return { ...tokens };
  },

  async calcExchangeVolume(token, xtzUsd, xtzUsdHistory) {
    token?.pairs?.forEach(async (pair, index) => {
      const volume = await getExchange24HrsVolume(pair.address);
      console.log("volume", volume);
      token.pairs[index].volume24 =
        volume?.reduce((prev, current) => {
          return prev + Number(current.xtzVolume);
        }, 0) * xtzUsd || 0;
    });

    // token.athBucket = await getTokenPriceBucket(token.id, token.allTimeHigh);
    // token.atlBucket = await getTokenPriceBucket(
    //   token.id,
    //   token.allTimeLow,
    //   "low"
    // );

    // token.allTimeHigh =
    //   this.binarySearch(xtzUsdHistory, new Date(token.athBucket).getTime()) *
    //   token.allTimeHigh;

    // token.allTimeLow =
    //   this.binarySearch(xtzUsdHistory, new Date(token.atlBucket).getTime()) *
    //   token.allTimeLow;

    return token;
  },

  async calcTokenVolume(tokenId, xtzUsd) {
    const volumes = await queryTokenXtzVolume(tokenId);
    const volume = volumes?.reduce((prev, current) => {
      return prev + Number(current.tezQty);
    }, 0);

    const volume24 = volume * xtzUsd || 0;

    return volume24;
  },

  async calculateTokenData(
    token,
    priceFeed,
    allTokensMetadata,
    xtzUsd,
    tokenHighAndLow,
    totalTvl
  ) {
    const tokenPrice = await getPrice(
      token.tokenAddress,
      token.tokenId?.toString(),
      priceFeed
    );

    const tokenMetadata = allTokensMetadata.find((el) => {
      return (
        el.token_address === token.tokenAddress &&
        (el.token_id ? el.token_id === (token.tokenId || 0) : true)
      );
    });

    const tokenPriceRange = filterQueryBytokenId(
      tokenHighAndLow,
      token.tokenAddress,
      token.tokenId?.toString()
    );

    const tvl =
      Number(
        filterQueryBytokenId(
          totalTvl,
          token.tokenAddress,
          token.tokenId?.toString()
        ).tvlUsd
      ) || 0;

    const element = tokenPrice;

    if (element) {
      if (element.thumbnailUri)
        element.thumbnailUri = ipfs.transformUri(element.thumbnailUri);

      const currentPrice = element?.currentPrice || false;
      const price = new BigNumber(currentPrice);

      const pricePair = element?.pairs.find(
        (el) => el.dex === "Quipuswap" && el.sides[1].symbol === "XTZ"
      );

      let calcSupply = 0;

      if (tokenMetadata) {
        calcSupply = new BigNumber(tokenMetadata.total_supply).div(
          new BigNumber(10).pow(tokenMetadata.decimals)
        );
      } else {
        calcSupply = new BigNumber(element.totalSupply).div(
          new BigNumber(10).pow(element.decimals)
        );
      }

      const mktCap = new BigNumber(calcSupply).times(element.usdValue);

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
      element.volume24 = 0;

      element.tokenTvl = tvl;

      // element.volume1DayChange =
      //   ((element.volume1Day - tokenVolume2DaysAgo) / tokenVolume2DaysAgo) *
      //     100 || 0;
      element.calcSupply = calcSupply.toNumber();

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

  binarySearch(arr, target) {
    // Find the middle element of the array
    const mid = Math.floor(arr.length / 2);

    // If the target is less than the middle element, search the left half of the array
    if (target < arr[mid][0]) {
      // If the left half of the array is empty, return the index of the middle element
      if (mid === 0) {
        return arr[mid][1];
      } else {
        return this.binarySearch(arr.slice(0, mid), target);
      }
    }
    // If the target is greater than the middle element, search the right half of the array
    else if (target > arr[mid][0]) {
      // If the right half of the array is empty, return the index of the middle element
      if (mid === arr.length - 1) {
        return arr[mid][1];
      } else {
        return this.binarySearch(arr.slice(mid + 1), target);
      }
    }
    // If the target is equal to the middle element, return the index of the middle element
    else {
      return arr[mid][1];
    }
  },
};
