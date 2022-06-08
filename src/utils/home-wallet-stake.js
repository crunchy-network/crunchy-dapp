import BigNumber from "bignumber.js";
import coingecko from "./coingecko";
import teztools from "./teztools";
import tzkt from "./tzkt";
// import merge from "deepmerge";

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
        tokenPool: tokenStorage.token_pool,
        totalReward: tokenStorage.total_reward,
        totalSupply: tokenStorage.total_supply,
        rewardPerShare: tokenStorage.reward_per_share,
        reward: tokenStorage.reward,
        rewardPerSec: tokenStorage.reward_per_sec,
      };
      userQuipuLp.push(tokenObjkt);
    }
  }

  return userQuipuLp;
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
    if (userStake[index].rewardValue === 0) {
      userStake[index].rewardValue =
        stake?.rewardsEarned * stake?.rewardToken?.currentPrice;
    }

    if (userStake[index].rewardValueUsd === 0) {
      userStake[index].rewardValueUsd =
        stake?.rewardsEarned * stake?.rewardToken?.usdValue;
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
      userStake[index].depositValueUsd = userStake[index].depositValue * xtzUsd;
    } else {
      userStake[index].depositValue +=
        stake?.depositAmount * stake?.poolToken?.currentPrice;
      userStake[index].depositValueUsd +=
        stake?.depositAmount * stake?.poolToken?.usdValue;
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

  async getUsersQuipusStake(pkh) {
    const xtzUsd = await coingecko.getXtzUsdPrice();

    const userQuipuStakes = await getUserQuipuLp(pkh);
    for (let i = 0; i < userQuipuStakes.length; i++) {
      const stake = userQuipuStakes[i];
      const tokenMetaData = await teztools.getTokenPrice(
        stake.tokenAddress,
        stake.tokenId
      );

      console.log(tokenMetaData);

      tokenMetaData.pairs = tokenMetaData.pairs.filter(
        (val) => val.address === stake.address
      );

      stake.depositAmount = new BigNumber(stake.ledger.balance)
        .div(new BigNumber(10).pow(6))
        .toNumber();

      stake.rewardValue = new BigNumber(
        new BigNumber(
          new BigNumber(stake.ledger.balance)
            .div(new BigNumber(stake.tokenPool))
            .times(new BigNumber(100))
            .times(new BigNumber(stake.reward))
        )
      )
        .div(new BigNumber(10).pow(6))
        .toNumber();

      stake.rewardValueUsd = stake.rewardValue * xtzUsd;
      tokenMetaData.isQuipuLp = true;

      userQuipuStakes[i] = {
        ...stake,
        poolToken: tokenMetaData,
        depositValue: 0,
        depositValueUsd: 0,
        totalValue: 0,
        totalValueUsd: 0,
      };
      console.log(tokenMetaData);
    }

    const stakeData = await sumStake(userQuipuStakes);
    console.log("==================");
    console.log(userQuipuStakes);
    console.log("==================");
    console.log("==================");
    console.log("Stake DATA", stakeData);
    console.log("==================");

    return stakeData;
  },
};
