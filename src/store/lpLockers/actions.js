import tzkt from "./../../utils/tzkt";
import dexIndexer from "./../../utils/dex-indexer";
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

  async updateLpCurrentPrices({ commit }) {
    return dexIndexer.getLPTokens().then(async (feed) => {
      const currentPrices = {};
      for (const token of feed) {
        const tokenId =
          token.tokenType === "fa1.2" ? "0" : token.tokenId.toString();
        currentPrices[`${token.tokenAddress}_${tokenId}`] = token.currentPrice;
      }

      commit("updatePriceFeed", feed);
      commit("updateCurrentPrices", currentPrices);
    });
  },

  async updateTokenPools({ commit }) {
    try {
      const allTokenPools = await dexIndexer.getAllTokenPools();

      // Call commit with the updated allTokenPools array
      commit("updateTokenPools", allTokenPools);
    } catch (error) {
      console.error("Error fetching all token pools:", error);
      return [];
    }
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
      await dispatch("updateTokenPools");
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

        const allTokens = state.priceFeed.concat(state.lpTokens);
        let tokenMeta = dexIndexer.findTokenInPriceFeed(l.token, allTokens);
        if (tokenMeta) {
          const tokenPools = state.tokenPools.filter(
            (el) =>
              el?.lpToken?.tokenAddress === tokenMeta.tokenAddress &&
              el?.lpToken?.tokenId === tokenMeta.tokenId
          )[0];
          const dexType = tokenPools?.dex?.type;

          let isQuipuLp = false;
          let isQuipuV2Lp = false;
          let isQuipuToken2TokenLp = false;
          let isQuipuStableLp = false;
          let isSpicyLp = false;
          let isPlentyLp = false;
          let isPlentyCtezLp = false;
          let isPlentyTezLp = false;
          let isPlentyStableLp = false;

          switch (dexType) {
            case "quipuswap":
              isQuipuLp = true;
              break;
            case "quipuswap_v2":
              isQuipuV2Lp = true;
              break;
            case "quipuswap_token2token":
              isQuipuToken2TokenLp = true;
              break;
            case "quipuswap_stable":
              isQuipuStableLp = true;
              break;
            case "spicy":
              isSpicyLp = true;
              break;
            case "plenty":
              isPlentyLp = true;
              break;
            case "plenty_ctez":
              isPlentyCtezLp = true;
              break;
            case "plenty_tez":
              isPlentyTezLp = true;
              break;
            case "plenty_stable":
              isPlentyStableLp = true;
              break;
            default:
              // Handle other cases here if needed
              break;
          }

          if (
            isQuipuLp ||
            isQuipuV2Lp ||
            isQuipuStableLp ||
            isQuipuToken2TokenLp ||
            isSpicyLp ||
            isPlentyLp ||
            isPlentyCtezLp ||
            isPlentyTezLp ||
            isPlentyStableLp
          ) {
            tokenPools.tokens[0].token = farmUtils.overrideMetadata(
              tokenPools.tokens[0].token
            );
            tokenPools.tokens[1].token = farmUtils.overrideMetadata(
              tokenPools.tokens[1].token
            );
            tokenPools.tokens[0].token.thumbnailUri =
              tokenPools.tokens[0].token.thumbnailUri !== null
                ? ipfs.transformUri(tokenPools.tokens[0].token.thumbnailUri)
                : null;
            tokenPools.tokens[1].token.thumbnailUri =
              tokenPools.tokens[1].token.thumbnailUri !== null
                ? ipfs.transformUri(tokenPools.tokens[1].token.thumbnailUri)
                : null;
          }

          const tokenProperties = {
            isQuipuLp: false,
            isQuipuV2Lp: false,
            isQuipuStableLp: false,
            isQuipuToken2TokenLp: false,
            isLbLp: false,
            isPlentyLp: false,
            isSpicyLp: false,
            decimals: 6,
            name:
              tokenPools.tokens[0].token.name +
              "/" +
              tokenPools.tokens[1].token.name,
            symbol:
              tokenPools.tokens[0].token.symbol +
              "/" +
              tokenPools.tokens[1].token.symbol,
            token1: tokenPools.tokens[0].token,
            token1Pool: tokenPools.tokens[0].reserves,
            token2: tokenPools.tokens[1].token,
            token2Pool: tokenPools.tokens[1].reserves,
          };

          let tezPool = 0;
          const totalSupply = tokenPools.tokens[0]?.dex?.params.find(
            (el) => el.name === "qptTokenSupply"
          )?.value;

          switch (true) {
            case isQuipuLp:
              tezPool = tokenPools.tokens[0]?.dex?.params.find(
                (el) => el.name === "tezPool"
              )?.value;

              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                isQuipuLp: true,
                realTokenAddress: tokenMeta.tokenAddress,
                realTokenId: tokenMeta.tokenId,
                tezPool: tezPool,
                qptTokenSupply: totalSupply,
              };
              break;
            case isQuipuV2Lp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                isQuipuV2Lp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            case isQuipuToken2TokenLp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                isQuipuToken2TokenLp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            case isQuipuStableLp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                isQuipuStableLp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            case isSpicyLp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                decimals: 18,
                isSpicyLp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            case isPlentyLp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                decimals: 18,
                isPlentyLp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            case isPlentyCtezLp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                decimals: 6,
                isPlentyCtezLp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            case isPlentyTezLp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                decimals: 18,
                isPlentyTezLp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            case isPlentyStableLp:
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                decimals: 12,
                isPlentyStableLp: true,
                qptTokenSupply: totalSupply,
              };
              break;
            default:
              break;
          }
        } else {
          tokenMeta = {};
        }

        let totalLiquidityTez = 0;
        let tvlTez = 0;

        if (!tokenMeta || !tokenMeta.qptTokenSupply || !tokenMeta.tezPool) {
          const poolK = await tzkt.getContractStorage(l.token.address);
          tokenMeta = {
            ...tokenMeta,
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

  async getLpBalance({ rootState }, { tokenAddress, tokenId, dexType }) {
    const isFactoryDex = ["quipuswap_v2", "quipuswap_token2token"].includes(
      dexType
    );
    const key = isFactoryDex
      ? { address: rootState.wallet.pkh }
      : rootState.wallet.pkh;

    return tzkt
      .getContractBigMapKeys(
        tokenAddress,
        farmUtils.getTokenLedgerKey(tokenAddress),
        { key: key, active: "true" }
      )
      .then((tokenLedger) => {
        console.log(tokenLedger);
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
              tokenId: 0,
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
                  tokenId: params.lpToken.tokenId,
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
                  tokenId: params.lpToken.tokenId,
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
              tokenId: 0,
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
