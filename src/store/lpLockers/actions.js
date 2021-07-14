import tzkt from './../../utils/tzkt'
import teztools from './../../utils/teztools'
import coingecko from './../../utils/coingecko'
import ipfs from './../../utils/ipfs'
import merge from 'deepmerge'
import { BigNumber } from 'bignumber.js'

export default {

  async updateLpXtzUsdVwap({ commit }) {
    return coingecko.getXtzUsdPrice().then(price => {
      commit('updateLpXtzUsdVwap', price);
    })
  },

  async updateLpCurrentPrices() {
    return teztools.getPricefeed().then(feed => {
      let currentPrices = {};
      for (const token of feed.contracts) {
        const tokenId = token.type === 'fa1.2' ? '0' : token.tokenId.toString();
        currentPrices[`${token.tokenAddress}_${tokenId}`] = token.currentPrice;
      }

      return { priceFeed: feed.contracts, currentPrices };
    });
  },

  async updateLpLockStorage({ state }) {
    return tzkt.getContractBigMapKeys(state.contract, "locks")
      .then(resp => {
        return resp.data;
      });
  },

  async fetchAllLpLocks({ state, commit, dispatch }) {
    dispatch('updateLpXtzUsdVwap');
    const { priceFeed } = await dispatch('updateLpCurrentPrices');
    const lockStorage = await dispatch('updateLpLockStorage');

    if (!state.loading && Object.keys(state.data).length === 0) {
      commit('updateLpLocksLoading', true);
      let locks = {};
      for (const x of lockStorage) {
        let l = merge({ id: x.key, ...x.value },
          {
            contract: state.contract,
            token: { "name": "???", "symbol": "???", thumbnailUri: "https://static.thenounproject.com/png/796573-200.png" },
            tvlTez: "~",
          }
        );

        let tokenMeta = teztools.findTokenInPriceFeed(l.token, priceFeed);
        if (tokenMeta) {
          tokenMeta.thumbnailUri = ipfs.transformUri(tokenMeta.thumbnailUri);

        // fallback to rpc storage
        } else {
          tokenMeta = {};
        }

        let totalLiquidityTez = 0;
        let tvlTez = 0;
        if (!tokenMeta || !Object.prototype.hasOwnProperty.call(tokenMeta, 'qptTokenSupply')) {
          const poolK = await tzkt.getContractStorage(l.token.address);
          tokenMeta = {
            tezPool: BigNumber(poolK.data.storage.tez_pool).div(BigNumber(10).pow(6)),
            qptTokenSupply: BigNumber(poolK.data.storage.total_supply).div(BigNumber(10).pow(6))
          };
        }

        tvlTez = BigNumber(l.amountLocked)
          .div(BigNumber(10).pow(6))
          .times(tokenMeta.tezPool)
          .div(tokenMeta.qptTokenSupply)
          .times(2).toNumber();

        totalLiquidityTez = BigNumber(tokenMeta.tezPool).times(2).toNumber();

        const amountLocked = BigNumber(l.amountLocked).div(BigNumber(10).pow(6)).toNumber();

        l = merge(l, {
          token: {
            ...tokenMeta,
            isQuipuLp: true,
            decimals: 6,
            tokenId: l.token.tokenId,
            realTokenAddress: tokenMeta.tokenAddress,
            realTokenId: tokenMeta.tokenId
          },
          amountLockedRaw: l.amountLocked,
          amountLocked: amountLocked,
          tvlTez: tvlTez,
          totalLiquidityTez: totalLiquidityTez,
          percentLocked: (amountLocked / tokenMeta.qptTokenSupply) * 100,
          timeUntilUnlocked: new Date(l.lockEndTime) - new Date()
        });

        locks[x.key] = l;
      }

      commit('updateLpLocksData', locks);
      commit('updateLpLocksLoading', false);
    }

  }

}
