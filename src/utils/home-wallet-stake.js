import coingecko from "./coingecko";
import tzkt from "./tzkt";

async function sumStake(userStake) {
  const crunchyData = {
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
    userStake[index].rewardValue =
      stake?.rewardsEarned * stake?.rewardToken?.currentPrice;
    userStake[index].rewardValueUsd =
      stake?.rewardsEarned * stake?.rewardToken?.usdValue;

    crunchyData.claimable += userStake[index].rewardValue;
    crunchyData.claimableUsd += userStake[index].rewardValueUsd;

    if (
      stake?.poolToken?.isQuipuLp ||
      stake?.poolToken?.isPlentyLp ||
      stake?.poolToken?.isLbLp
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

    crunchyData.staked += userStake[index].depositValue;
    crunchyData.stakedUsd += userStake[index].depositValueUsd;
  }

  crunchyData.totalValue = crunchyData?.staked + crunchyData?.claimable;
  crunchyData.totalValueUsd =
    crunchyData?.stakedUsd + crunchyData?.claimableUsd;

  return crunchyData;
}

export default {
  async getUsersCrunchyStake(farmsData, pkh) {
    const userStake = [];
    const { data: userFarms } = await tzkt.getContractBigMapKeys(
      process.env.VUE_APP_CONTRACTS_FARM_ESTATE,
      "ledger",
      { "key.address": pkh, active: "true" }
    );

    for (let index = 0; index < userFarms.length; index++) {
      const farms = farmsData[parseInt(userFarms[index].key.nat)];

      const { value } = userFarms[index];

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
        depositValue: 0,
        depositValueUsd: 0,
        rewardValue: 0,
        rewardValueUsd: 0,
        totalValue: 0,
        totalValueUsd: 0,
      });
    }

    const stakeData = await sumStake(userStake);
    return stakeData;
  },
};
