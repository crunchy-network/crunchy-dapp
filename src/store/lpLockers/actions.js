import tzkt from "./../../utils/tzkt";
import teztools from "./../../utils/teztools";
import ipfs from "./../../utils/ipfs";
import farmUtils from "./../../utils/farm";
import { getContract, getWalletContract, getBatch } from "./../../utils/tezos";
import merge from "deepmerge";
import { BigNumber } from "bignumber.js";

export default {
  async updateLpXtzUsdVwap({ commit }) {
    return tzkt.getXtzUsdPrice().then((price) => {
      commit("updateLpXtzUsdVwap", price);
    });
  },

  async updateLpCurrentPrices({ commit, rootState, dispatch }) {
    if (Object.keys(rootState.priceFeed.data).length < 1) {
      await dispatch("softLoadPriceFeedAndData");
    }
    const tokenFeed = rootState.priceFeed.data;
    const currentPrices = {};
    const feed = [];

    // eslint-disable-next-line no-unused-vars
    for (const [_, token] of Object.entries(tokenFeed)) {
      console.log(token);
      console.log("---------------------");
      currentPrices[`${token.id}`] = token.currentPrice;
      feed.push(token);
    }

    commit("updatePriceFeed", feed);
    commit("updateCurrentPrices", currentPrices);
  },

  async updateLpLockStorage({ state }) {
    return tzkt.getContractBigMapKeys(state.contract, "locks").then((resp) => {
      return resp.data;
    });
  },

  updateLpLocksTotalTvlTez({ commit, state }) {
    let total = 0;
    for (const id in state.data) {
      if (state.data[id].active === false) {
        continue;
      }

      const tvl = Number(state.data[id].tvlTez);
      if (!Number.isNaN(tvl)) {
        total += Number(tvl);
      }
    }
    commit("updateLpLocksTotalTvlTez", total);
  },

  async fetchAllLpLocks({ state, commit, dispatch }) {
    dispatch("updateLpXtzUsdVwap");

    if (!state.loading && Object.keys(state.data).length === 0) {
      commit("updateLpLocksLoading", true);

      await dispatch("updateLpCurrentPrices");
      const lockStorage = await dispatch("updateLpLockStorage");

      const locks = {};
      for (const x of lockStorage) {
        let l = merge(
          { id: x.key, ...x.value, active: x.active },
          {
            contract: state.contract,
            token: {
              name: "???",
              symbol: "???",
              thumbnailUri:
                "https://static.thenounproject.com/png/796573-200.png",
            },
            tvlTez: "~",
          }
        );

        let tokenMeta = teztools.findTokenInPriceFeed(l.token, state.priceFeed);
        if (tokenMeta) {
          if (tokenMeta.thumbnailUri) {
            tokenMeta.thumbnailUri = ipfs.transformUri(tokenMeta.thumbnailUri);
          }

          // fallback to rpc storage
        } else {
          tokenMeta = {};
        }

        let totalLiquidityTez = 0;
        let tvlTez = 0;
        if (
          !tokenMeta ||
          !Object.prototype.hasOwnProperty.call(tokenMeta, "qptTokenSupply")
        ) {
          const poolK = await tzkt.getContractStorage(l.token.address);
          tokenMeta = {
            tezPool: BigNumber(poolK.data.storage.tez_pool)
              .div(BigNumber(10).pow(6))
              .toNumber(),
            qptTokenSupply: BigNumber(poolK.data.storage.total_supply)
              .div(BigNumber(10).pow(6))
              .toNumber(),
          };
        }

        tvlTez = BigNumber(l.amountLocked)
          .div(BigNumber(10).pow(6))
          .times(tokenMeta.tezPool)
          .div(tokenMeta.qptTokenSupply)
          .times(2)
          .toNumber();

        totalLiquidityTez = BigNumber(tokenMeta.tezPool).times(2).toNumber();

        const amountLocked = BigNumber(l.amountLocked)
          .div(BigNumber(10).pow(6))
          .toNumber();

        const now = new Date();

        l = merge(l, {
          token: {
            ...tokenMeta,
            isQuipuLp: true,
            decimals: 6,
            tokenId: l.token.tokenId,
            realTokenAddress: tokenMeta.tokenAddress,
            realTokenId: tokenMeta.tokenId,
          },
          amountLockedRaw: l.amountLocked,
          amountLocked: amountLocked,
          tvlTez: tvlTez,
          totalLiquidityTez: totalLiquidityTez,
          percentLocked: (amountLocked / tokenMeta.qptTokenSupply) * 100,
          timeUntilUnlocked: Math.max(new Date(l.lockEndTime) - now, 0),
          isUnlocked: new Date(l.lockEndTime) <= now,
        });

        locks[x.key] = l;
      }

      commit("updateLpLocksData", locks);
      commit("updateLpLocksLoading", false);

      dispatch("updateLpLocksTotalTvlTez");
    }
  },

  async getLpBalance({ rootState }, tokenAddress) {
    return tzkt
      .getContractBigMapKeys(
        tokenAddress,
        farmUtils.getTokenLedgerKey(tokenAddress),
        { key: rootState.wallet.pkh, active: "true" }
      )
      .then((tokenLedger) => {
        let tokenBal = BigNumber(0);
        if (tokenLedger.data.length) {
          if (typeof tokenLedger.data[0].value === "object") {
            tokenBal = BigNumber(tokenLedger.data[0].value.balance);
          } else {
            tokenBal = BigNumber(tokenLedger.data[0].value);
          }
          if (tokenAddress === "KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo") {
            tokenBal = tokenBal.idiv(1);
          } else {
            tokenBal = tokenBal.div(BigNumber(10).pow(6));
          }
        }
        console.log("tokenBal.toNumber", tokenBal.toNumber());
        return tokenBal.toNumber();
      });
  },

  async createLpLock({ state, rootState }, params) {
    const locker = await getContract(state.contract);
    const crnchy = await getContract(state.crnchyAddress);
    const lpToken = await getContract(params.lpToken.address);

    let amount = BigNumber(params.amount)
      .times(BigNumber(10).pow(6))
      .idiv(1)
      .toNumber();
    if (params.lpToken.address === "KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo") {
      amount = BigNumber(params.amount).idiv(1).toNumber();
    }

    const batch = await getBatch()
      .withContractCall(
        crnchy.methods.update_operators([
          {
            add_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: 0,
            },
          },
        ])
      )
      .withContractCall(
        params.lpToken.tokenType === "fa2"
          ? lpToken.methods.update_operators([
              {
                add_operator: {
                  owner: rootState.wallet.pkh,
                  operator: state.contract,
                  token_id: params.lpToken.tokenId,
                },
              },
            ])
          : lpToken.methods.approve(state.contract, amount)
      )
      .withContractCall(
        locker.methods.lock(
          // tokenAddress, tokenId, (fa1 | fa2), unit
          params.lpToken.address,
          params.lpToken.tokenId,
          params.lpToken.tokenType,
          "unit",

          // amount to lock
          amount,

          // lockEndTime
          params.lockEndTime,

          // serviceFeeId
          params.serviceFeeId
        )
      )
      .withContractCall(
        params.lpToken.tokenType === "fa2"
          ? lpToken.methods.update_operators([
              {
                remove_operator: {
                  owner: rootState.wallet.pkh,
                  operator: state.contract,
                  token_id: params.lpToken.tokenId,
                },
              },
            ])
          : lpToken.methods.approve(state.contract, 0)
      )
      .withContractCall(
        crnchy.methods.update_operators([
          {
            remove_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: 0,
            },
          },
        ])
      );

    const tx = await batch.send();
    return tx.confirmation();
  },

  async withdrawLp({ state }, params) {
    const locker = await getWalletContract(state.contract);
    const tx = await locker.methods.withdraw(params.lockId).send();
    return tx.confirmation();
  },

  async withdrawLpProfit({ state }, params) {
    const locker = await getWalletContract(state.contract);
    const tx = await locker.methods.withdrawProfit(params.lockId).send();
    return tx.confirmation();
  },
};
