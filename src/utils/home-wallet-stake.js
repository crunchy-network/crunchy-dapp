import axios from "axios";
import BigNumber from "bignumber.js";
import coingecko from "./coingecko";
import ipfs from "./ipfs";
import teztools from "./teztools";
import tzkt from "./tzkt";

async function getUserQuipuLp(pkh) {
  const userQuipuLp = [];
  const { data: quipuLp } = await tzkt.getContractBigMapKeys(
    process.env.VUE_APP_CONTRACTS_QUIPU_FA2_FACTORY,
    "token_to_exchange"
  );

  const quipuLpAddress = quipuLp.map((val) => val.value);

  for (let index = 0; index < quipuLpAddress.length; index++) {
    const val = quipuLpAddress[index];

    const { data: resp } = await tzkt.getContractBigMapKeys(val, "ledger", {
      key: pkh,
    });
    if (resp.length > 0) {
      const [
        {
          data: { storage: tokenStorage },
        },
        { data: userReward },
      ] = await Promise.all([
        await tzkt.getContractStorage(val),
        await tzkt.getContractBigMapKeys(val, "user_rewards", {
          key: pkh,
        }),
      ]);

      const tokenObjkt = {
        address: val,
        ledger: resp[0].value,
        user_rewards: userReward[0].value,
        tokenAddress: tokenStorage.token_address,
        tokenId: tokenStorage.token_id,
        tezPool: tokenStorage.tez_pool,
        tokenPool: tokenStorage.token_pool,
        totalReward: tokenStorage.total_reward,
        totalSupply: tokenStorage.total_supply,
        rewardPerShare: tokenStorage.reward_per_share,
        rewardPaid: tokenStorage.reward_paid,
        reward: tokenStorage.reward,
        rewardPerSec: tokenStorage.reward_per_sec,
      };
      userQuipuLp.push(tokenObjkt);
    }
  }

  return userQuipuLp;
}

function calculateGIFRewards(
  claimableXTZ,
  multiplier,
  xtzPerGif,
  lastXtzPerGif,
  userGif,
  currentCycle,
  lastUpdate,
  totalGif,
  revenueTier,
  userTier
) {
  let value = new BigNumber(0);

  if (multiplier) {
    // Initialize variables

    value = value.plus(claimableXTZ);
    if (userTier.isEqualTo(revenueTier)) {
      value = value.plus(
        new BigNumber(
          new BigNumber(xtzPerGif.minus(lastXtzPerGif)).times(userGif)
        ).div(multiplier)
      );

      if (
        currentCycle &&
        Date.now() < new Date(currentCycle.end_time).getTime()
      ) {
        value = value
          .plus(
            new BigNumber(
              new BigNumber(currentCycle.xtz_per_sec).times(
                new BigNumber(Date.now()).minus(
                  new BigNumber(lastUpdate.getTime())
                )
              )
            ).div(new BigNumber(10).pow(3))
          )
          .times(userGif)
          .div(totalGif.times(multiplier));
      }
    }
  }

  return value;
}

async function sumStake(userStake) {
  const userStakesData = {
    staked: 0,
    claimable: 0,
    totalValue: 0,
    stakedUsd: 0,
    claimableUsd: 0,
    totalValueUsd: 0,
    data: userStake,
  };

  for (let index = 0; index < userStake.length; index++) {
    const stake = userStake[index];
    if (isNaN(stake.rewardsEarned)) {
      userStake[index].rewardsEarned = 0;
    }
    if (isNaN(stake.depositAmount)) {
      userStake[index].depositAmount = 0;
    }

    // Check for NaN Values in Stake
    if (userStake[index].rewardValue === 0) {
      userStake[index].rewardValue =
        stake?.rewardsEarned * (stake?.rewardToken?.currentPrice || 0);
    }

    if (userStake[index].rewardValueUsd === 0) {
      userStake[index].rewardValueUsd =
        stake?.rewardsEarned * (stake?.rewardToken?.usdValue || 0);
    }
    userStakesData.claimable += userStake[index].rewardValue;
    userStakesData.claimableUsd += userStake[index].rewardValueUsd;

    if (
      stake?.poolToken?.isQuipuLp ||
      stake?.poolToken?.isPlentyLp ||
      stake?.poolToken?.isLbLp ||
      stake?.poolToken?.is_vl_lp
    ) {
      const stakedPool =
        stake?.poolToken?.pairs[0].tvl / stake?.poolToken?.pairs[0].lptSupply;
      const xtzUsd = await coingecko.getXtzUsdPrice();

      userStake[index].depositValue = stakedPool * stake?.depositAmount;
      if (isNaN(userStake[index].depositValue)) {
        userStake[index].depositValue = 0;
      }
      userStake[index].depositValueUsd = userStake[index].depositValue * xtzUsd;
    } else {
      userStake[index].depositValue +=
        stake?.depositAmount * (stake?.poolToken?.currentPrice || 0);
      userStake[index].depositValueUsd +=
        stake?.depositAmount * (stake?.poolToken?.usdValue || 0);
    }

    userStake[index].totalValue =
      userStake[index].depositValue + userStake[index].rewardValue;
    userStake[index].totalValueUsd =
      userStake[index].depositValueUsd + userStake[index].rewardValueUsd;

    userStakesData.staked += userStake[index].depositValue;
    userStakesData.stakedUsd += userStake[index].depositValueUsd;
  }

  userStakesData.totalValue =
    userStakesData?.staked + userStakesData?.claimable;
  userStakesData.totalValueUsd =
    userStakesData?.stakedUsd + userStakesData?.claimableUsd;

  return userStakesData;
}

export default {
  async getUsersCrunchyStake(farmsData, pkh) {
    const userStake = [];
    let { data: userFarms } = await tzkt.getContractBigMapKeys(
      process.env.VUE_APP_CONTRACTS_FARM_ESTATE,
      "ledger",
      { "key.address": pkh, active: "true" }
    );

    userFarms = userFarms.filter(
      (val) => val.value.rewardDebt !== "0" || val.value.amount !== "0"
    );

    for (let index = 0; index < userFarms.length; index++) {
      const farms = farmsData[parseInt(userFarms[index].key.nat)];
      const { value } = userFarms[index];

      if (farms) {
        const depValAmount = new BigNumber(value.amount).toNumber();
        const rewValAmount = new BigNumber(value.rewardDebt).toNumber();

        if (farms.depositAmount === 0 && depValAmount !== 0) {
          const dAmount = new BigNumber(depValAmount).div(
            new BigNumber(10).pow(farms.poolToken.decimals)
          );
          farms.depositAmount = dAmount;
        }

        if (farms.rewardsEarned === 0 && rewValAmount !== 0) {
          const rewAmount = new BigNumber(rewValAmount).div(
            new BigNumber(10).pow(farms.rewardToken.decimals)
          );
          farms.rewardsEarned = rewAmount;
        }

        userStake.push({
          ...value,
          endTime: farms?.endTime,
          depositAmount: farms.depositAmount,
          rewardsEarned: farms.rewardsEarned,
          id: farms?.id,
          duration: farms?.duration,
          startTime: farms?.startTime,
          lockDuration: farms?.lockDuration,
          poolToken: farms?.poolToken,
          rewardToken: farms?.rewardToken,
          started: farms.started,
          depositValue: 0,
          depositValueUsd: 0,
          rewardValue: 0,
          rewardValueUsd: 0,
          totalValue: 0,
          totalValueUsd: 0,
        });
      }
    }

    const stakeData = await sumStake(userStake);

    return stakeData;
  },

  async getUsersQuipusStake(pkh, priceFeed) {
    const userQuipuStakes = await getUserQuipuLp(pkh);
    for (let i = 0; i < userQuipuStakes.length; i++) {
      const stake = userQuipuStakes[i];

      const token = {
        tokenAddress: stake.tokenAddress,
        address: stake.address,
        tokenId: stake.tokenId,
        tokenType: {
          fa2: true,
        },
      };

      const tokenMetaData = await teztools.findTokenInPriceFeed(
        token,
        priceFeed
      );

      tokenMetaData.pairs = tokenMetaData.pairs.filter(
        (val) => val.address === stake.address
      );

      stake.depositAmount = new BigNumber(stake.ledger.balance)
        .div(new BigNumber(10).pow(6))
        .toNumber();

      stake.rewardValue = "-";

      stake.rewardValueUsd = "-";
      tokenMetaData.isQuipuLp = true;

      userQuipuStakes[i] = {
        ...stake,
        poolToken: tokenMetaData,
        depositValue: 0,
        depositValueUsd: 0,
        totalValue: 0,
        totalValueUsd: 0,
      };
    }

    const stakeData = await sumStake(userQuipuStakes);
    return stakeData;
  },

  async getDogamiStake(pkh) {
    const userStakes = [];

    const { data: dogami } = await tzkt.getContractStorage(
      process.env.VUE_APP_DOGAMI_STAKE
    );

    const [
      { data: tokenMetaData },
      {
        data: [{ value: addressId }],
      },
    ] = await Promise.all([
      await axios.get(
        `https://api.teztools.io/v1/${dogami.FA12TokenContract}/price`
      ),
      await tzkt.getContractBigMapKeys(
        process.env.VUE_APP_DOGAMI_STAKE,
        "addressId",
        { key: pkh }
      ),
    ]);

    if (tokenMetaData.thumbnailUri) {
      tokenMetaData.thumbnailUri = ipfs.transformUri(
        tokenMetaData.thumbnailUri
      );
    }

    if (addressId) {
      const {
        data: [{ value: stake }],
      } = await tzkt.getContractBigMapKeys(
        process.env.VUE_APP_DOGAMI_STAKE,
        "userStakeFlexPack",
        { key: addressId }
      );

      const userStake = stake[pkh];
      const depositAmount = new BigNumber(userStake.value)
        .div(new BigNumber(10).pow(tokenMetaData.decimals))
        .toNumber();
      const rewardsEarned = new BigNumber(userStake.reward)
        .div(new BigNumber(10).pow(tokenMetaData.decimals))
        .toNumber();

      userStakes.push({
        ...dogami,
        poolToken: tokenMetaData,
        rewardToken: tokenMetaData,
        depositAmount,
        rewardsEarned,
        depositValue: 0,
        depositValueUsd: 0,
        rewardValue: 0,
        rewardValueUsd: 0,
        totalValue: 0,
        totalValueUsd: 0,
      });
    }

    return sumStake(userStakes);
  },
  async getGIFStake(pkh) {
    const userStakes = [];

    const { data: gif } = await tzkt.getContractStorage(
      process.env.VUE_APP_GIF_STAKE
    );

    const [
      { data: poolToken },
      xtzUsd,
      {
        data: [{ value: userStake }],
      },
    ] = await Promise.all([
      await axios.get(
        `https://api.teztools.io/v1/${gif.staking.gif.address}_0/price`
      ),
      await coingecko.getXtzUsdPrice(),
      await tzkt.getContractBigMapKeys(
        process.env.VUE_APP_GIF_STAKE,
        "ledger",
        { key: pkh }
      ),
    ]);

    if (poolToken.thumbnailUri) {
      poolToken.thumbnailUri = ipfs.transformUri(poolToken.thumbnailUri);
    }

    const rewardToken = {
      currentPrice: 1,
      decimals: 6,
      usdValue: xtzUsd,
    };
    const revenue = gif.revenue;
    const revenueTier = new BigNumber(gif.staking.revenue_tier);

    if (userStake) {
      console.log(userStake);
      const depositAmount = new BigNumber(userStake.gif)
        .div(new BigNumber(10).pow(poolToken.decimals))
        .toNumber();

      let rewardsEarned = 0;
      // Calculating Rewards earned
      const claimableXTZ = new BigNumber(userStake.claimable_xtz);
      const multiplier = new BigNumber(revenue.multiplier);
      const xtzPerGif = new BigNumber(revenue.xtz_per_gif);
      const lastXtzPerGif = new BigNumber(userStake.last_xtz_per_gif);
      const userGif = new BigNumber(userStake.gif);
      const currentCycle = revenue.current_cycle;
      const lastUpdate = new Date(revenue.last_update);
      const totalGif = new BigNumber(revenue.total_gif);
      const userTier = new BigNumber(Object.keys(userStake.tiers).length);

      rewardsEarned = calculateGIFRewards(
        claimableXTZ,
        multiplier,
        xtzPerGif,
        lastXtzPerGif,
        userGif,
        currentCycle,
        lastUpdate,
        totalGif,
        revenueTier,
        userTier
      )
        .div(new BigNumber(10).pow(6))
        .toNumber();
      // Calculating Rewards earned

      userStakes.push({
        ...gif,
        poolToken,
        rewardToken,
        depositAmount,
        rewardsEarned,
        depositValue: 0,
        depositValueUsd: 0,
        rewardValue: 0,
        rewardValueUsd: 0,
        totalValue: 0,
        totalValueUsd: 0,
      });
    }

    return sumStake(userStakes);
  },
};
