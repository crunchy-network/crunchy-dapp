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

  async updateLpTokens({ commit, dispatch }) {
    return dexIndexer.getLPTokens().then((feed) => {
      commit("updateLpTokens", feed);
    });
  },

  async updateTokenPools({ commit, dispatch }) {
    const usdValue = await tzkt.getXtzUsdPrice();
    const tez = {
      asset: "XTZ",
      balance: 0,
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAABC1BMVEUAAABCfe5LcORAfetCffBDfe9CffBCfe9Cf/BBfe9Df/JBe+xDeu5Df/JCfvBCfO9Cfe9Cfe9DfvBDfvBBfe9BffA+eu9Df/JCfe8+eeVCfvFCfe9Cfe9Cfu5BffBCffBBfu8+fO9CffJEf/JEfe9CfvFDfu////9Ff+/8/f8+e+87eO9FgvdGg/rr8f5EgPRWjPFTifFAfO9Ghfz0+P5gk/I4d+5Hhv+vyPg3du7n7/1Ef/BIgvD5+v+hv/dOhvBomPNajvHP3vu50PpvnPPv9P7d6PzW5PyMsfbn7v3H2fvB1fp5pPTj7P1ml/KIrfWCqfWow/irxvi0zPmzyvmZufeStPaWt/Ywce7hqexUAAAAJnRSTlMA/QMTxv6QilFW0DQM9a9K8d7WwrYuB/nqHJnL4l4ooHMXQ9p0cw375J8AAAlzSURBVHja1VsHe9JAGE7CHqWD2ta21h2uGQQCJEZWyxbtcv//X+J3hMuJwh2XxEf9nhaoIO9737z1SUKiKIunRCH3LF1KHpzsyarc3js/SJbSr3OFBPnMH5LFFx9dZNPJ/T3LNQ3DardVkLZlGUbDNfb2y+ncxVH8HOi4EtnTM7nRMA1L9kVdiP86ZRmm2ZDP0rsJyiFO+KPc0xOrYbYpMhXKo202rJPTXJFoLDbdP8rsG67lY7MEf8Byjf30o9goKPCTPZRd4ydwLgmjIR/u4v8Zy+izZaPRBnQBAVs0rHJWiewLCsAnDZMxeIYaTKu8C18RDb5QMk1ADyWYwmGBUAiFX8wcE/hwFFKNnUxCUsIOfzcPtlcjCfjCS2IH8eFbBh+ebwfDOC1Kijh+Ie8ytC9kB/esIM7gyY5B8SMrYeeJ4PCVjEmsHwsFy8wIOIIiJUo85xePyBKNBi7+86R7DPjxMnCThAEX/3HeJPBxUjDzjwkDDv4BwY+ZQeMAGMQ7/vh1AP6Xb1D82HWQf85jkEgyxo+IhNdBMsFRQMlljF8jEpqC7JYUhYWfYdkf1a9rC6nrekgGKbmRAZiN+E/MlLwR3u4Pqr68G7acsCpImU8AaAP+ox1LVhkEqhUi3V5HReEYWDuPNjEo5lnlF/DeVy4X8PDUrGkopA6MfHGDAk5ZDohV0JlXiLyraeEdEdxgHf6uwSkASEOBDqoRCBwbu+sYFPexATgM6tVKZAJghIPiugjkZ0Bk19/FQEAlsbg6A6MRwNLA21gIpIJIoAQOqQLECYir4FBRfvFAK0XfFycg7gbZVRUcMWrQHyFgJpUVBWSZDhA/ATW1qgKlbEYjEEkFwOQFSwGIik0JXNuII9urQFGYIaDpGhGnH+SBuqP9JvqKIF4gAAFSBY9VRhW8bgVyPSKZcDwK/pnK7VUgt1ctpo0AkOQCeEy78maz126aP0mFSHONXP4szZmHuDWJXwWAwLgSTi5nHtsJ9otLBeSMFItA9bJLx0W/fpOQj8DzVxsxNECSkSI9dRkeoF13w2qg8t5m2+Cpb4PECSsI7f7DGyqfiBN0h2/Wy8MNxUc2Yk7OThJ+GeDMA3QqXicIw76nrxHte2sc4KsYn8kAbIBjgCaByInI7t/wx09tcArwjDoknIoR0mDO5uMPYfzcdHyG99YvjtXYCDjfCP5HXWXhk1x0AQRyYIF4CCB9BPA+vkbw2ek4BwTSZkwEwAH8d+n4uTZIA4FyXARUew7YGP+B4HMJlCELnBvxEEBOb4nfI/j8idl5QirsWbEQQM4HDI/xnW1X77K1V4BCIEciQN8aL/F1Lj4tB1ZOegaFIBYTDABcDB+noleQB+MggLyPYvg0DEpGDASQc3/p4zsC8NgLS1IyBgJIvx4T+6sikrKS0oEVgwY6U0DH41fFCMjWgXTejkwAeZ+wAyzsL0igfSLtRSaAvNkCf/YdTwiEKMDJt9SG50gEkH7bXGxbXd99vRvVNM8WigMJHiIRQHZnghXQnPrrhfd3HUdk1RadgD4k+0bLGfG7Xt3b3hklORoB5H0FfMJg+TueadsqoR3RCZEz6i7G3W02u0t4/DCv62hLJzyJQgBp/QlGnN+1Ov3Wh49vAwoTnyCXwHnERGQPYfCfWpqj2bbmeP2v1YBBXUNbJaKklQpNAP7udj+3wOtBVPi1vfqAMBjY29SCpGgxugnWBZiA3e/dOjoAI20Bh5DeCRh88dAWxUigHNOYB+m2dLQIQoCHyVB12LGXUUk2Uy/HfDeQG2nplSuLxOGcjO/eQf6YAbMGmPfL8SLnjsTkG4dLwH0m5SxZQAXeQ7Dy0YNU3J9WupUZVfh0qaUmmIl3qJwTmpQC2CjYIbn1Ogvf82oAeNm91RGtTXR6yp2UCk3LQWwyvMpNy9M13bPvIfJgKaojuqNN9lQmHZs/LZe2W5vSyTchUBn3Rq3RbFBZlKKWhqia/ECAN3gbVWaZLM0E3PANYQDSJS/vQAGUQI985M7hEEiTxamAQPLDOqeJH28GUSCqJRwHHuIvTi92VCEVqPaX6s+bVFB/7wk+maGQRfKcVZIA9hgvz4/OwAZCDLz6lwHdMKw+1Al+sK81XhKYdjj7xUeMwzJWQvTU69Gs93k4/NT7UPc0tLZiAIGbvo3YeVAhW/VCAtGP94UdkDXTUKRtebIkW3B6xtim4+5cdbBg+I0EcDlgb9MxNir5vqB7nqcTHYtqgG5Ugg3C3BiCAjz68tD70KGO/rsTThg+IKegEChkszoljl8b+On2ig7ytzAcMPPwfjE4sxS3gV2f+LmAZOG1iWjosSwAMRAc26uikeiRjEwLM9XAN5KKv3mIkYXwgQU9tRR0wPYkKAlNYuiAQHDEfaUj/tml74YpUQ+o0m35X72gT9676diMIHwBwEQUqMmRCVAXIMZ5cBCjElN4cRXgXfHABN26vUqOWOASLMDeqpfCq0AfbHBCpF9VaC1k16EVFQgS8L4QDYxXwhDZ6pQQGG0mkPLLAAj77JJ1lNT0YQa3K/iq9pngDzVWCFD8IBekhBg4fiKoXn9HIKRA6epnkoSqdQ1tvspTAEiBKxyM6yTVe9XTFwszW3O00ZTgNxkGWH+dqnhgCDHQP1z6YFOYlHQArFO7n1covoOYVUD8Gg8VugAhjti9mc4Hky7dJLkBfMFrPOI1CTmzLtQj/EMEXuG/up/6oH/mYRnjKpcIg9vBApaKf6Z5pWsMfOPsiHmZTcgP1Lv5Lye7015L0xESvcxGr/OJTtHt2v3H+WSCL/lNBp9nrY6jATznOh/nQqMYBU33HNTH1xw7Og5IxFmNQQSyumlKrhxifgw5QNNs/JJ7Wlsi+JxLrcIsmOA0AyUT3Gvdf/Zab0JS/u2Lzf7VbqKDuPEPAP/fv9yOGSSSrizHDH/sJuFa919scGiUEiItFpCRrFhbPIyMIin/T5OLf8n0zE3J8eC7+UKYRqPiqRGHEmTDyhQJvmir18s4Wr3yL6TQ3WaJzE4jih1k2TzGw4/S7ndoRWn3M0qFyB2Hu2UrbMOjkcwS+Cj9tkoWKIRo+TTKAB9P16myeyg3xJpeXfkwp8TYdysV0rjtV+WSkEGshrGfeRR753Exd7pV47NrnTzNHf2R3mspsZuG1m/TNKzU763fkO/NBrR+n2YTf7L9/Ogily6T5nfLb35vW4YBA8fN71lofhfTfaT2/3N88i3vneD2/2ch2/9/ABtem2hAUcJLAAAAAElFTkSuQmCC",
      assetSlug: "tez",
      priceUsd: usdValue,
      decimals: 6,
      usdValue,
    };

    let allTokenPools = [];
    try {
      allTokenPools = await dexIndexer.getAllTokenPools();

      // Call commit with the updated allTokenPools array
      commit("updateTokenPools", [tez, ...allTokenPools]);
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
      await dispatch("updateLpTokens");
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

          let token;
          let tezPool = 0;
          const totalSupply = tokenMeta.totalSupply;

          switch (true) {
            case isQuipuLp:
              token = tokenPools.tokens.find(
                (el) => el.token.tokenAddress === "tez"
              );
              tezPool = token.reserves;
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
              token = tokenPools.tokens.find(
                (el) => el.token.tokenAddress === "tez"
              );
              tezPool = token.reserves;
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                isQuipuV2Lp: true,
                tezPool: tezPool,
                qptTokenSupply: totalSupply,
              };
              break;
            case isQuipuToken2TokenLp:
              token = tokenPools.tokens.find(
                (el) => el.token.tokenAddress === "tez"
              );
              tezPool = BigNumber(token.reserves).div(
                BigNumber(10).pow(token.token.decimals).toNumber()
              );
              tokenMeta = {
                ...tokenProperties,
                ...tokenMeta,
                isQuipuToken2TokenLp: true,
                tezPool: tezPool,
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

        totalLiquidityTez = BigNumber(tokenMeta.tezPool)
          .div(BigNumber(10).pow(6))
          .times(2)
          .toNumber();

        const amountLocked = BigNumber(l.amountLocked)
          .div(BigNumber(10).pow(6))
          .toNumber();

        const percentLocked = BigNumber(tvlTez)
          .div(totalLiquidityTez)
          .times(100)
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
          percentLocked: percentLocked,
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
    const isSpicyDex = ["spicy"].includes(dexType);
    console.log(dexType, isSpicyDex);
    const key =
      isFactoryDex || isSpicyDex
        ? { address: rootState.wallet.pkh }
        : rootState.wallet.pkh;

    return await tzkt
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
          } else if (isSpicyDex) {
            tokenBal = tokenBal.div(BigNumber(10).pow(18));
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
