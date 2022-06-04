import BigNumber from "bignumber.js";
import coingecko from "./coingecko";
import teztools from "./teztools";
import tzkt from "./tzkt";
import merge from "deepmerge";

function calcQuipuPendingReward(farmStorage, userStorage) {
  let pendingRewards = 0;
  const timediff = Date.now() - new Date(farmStorage.upd);
  const userEarned = new BigNumber(userStorage.earned).toNumber();
  const userPrevEarned = new BigNumber(userStorage.prev_earned).toNumber();
  const userStaked = new BigNumber(userStorage.staked).toNumber();
  const rewardPerSec = new BigNumber(farmStorage.reward_per_second).toNumber();
  const rewardPerShare = new BigNumber(farmStorage.reward_per_share).toNumber();
  const farmStaked = new BigNumber(farmStorage.staked).toNumber();
  const reward = timediff * rewardPerSec;
  const updateRewardPerShare = rewardPerShare + reward / farmStaked;

  pendingRewards =
    userEarned + userStaked * updateRewardPerShare - userPrevEarned;

  return pendingRewards;
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
    userStake[index].rewardValue =
      stake?.rewardsEarned * stake?.rewardToken?.currentPrice;
    userStake[index].rewardValueUsd =
      stake?.rewardsEarned * stake?.rewardToken?.usdValue;

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
    const { contracts: priceFeed } = await teztools.getPricefeed();
    const userStake = [];
    let { data: userFarms } = await tzkt.getContractBigMapKeys(
      process.env.VUE_APP_CONTRACTS_QUIPU_FARM_ESTATE,
      "users_info",
      { "key.address": pkh, active: "true" }
    );

    userFarms = userFarms.filter(
      (val) => val.value.staked !== "0" || val.value.earned !== "0"
    );

    for (let index = 0; index < userFarms.length; index++) {
      const userFarm = userFarms[index];

      const { data: farmStorage } = await tzkt.getContractBigMapKeys(
        process.env.VUE_APP_CONTRACTS_QUIPU_FARM_ESTATE,
        "farms",
        { key: userFarm.key.nat, active: "true" }
      );

      const userFarmValue = userFarm.value;
      const { value: farmValue } = farmStorage[0];

      // console.log(farmValue);

      const ended = new Date() >= farmValue?.end_time;
      const started = new Date() >= farmValue?.start_time;

      const fa2 = farmValue.stake_params?.staked_token.fA2 !== undefined;
      const rewardFa2 = farmValue?.reward_token.fA2 !== undefined;

      const token = farmValue.stake_params.staked_token[fa2 ? "fA2" : "fA1"];
      const rewToken = farmValue.reward_token[rewardFa2 ? "fA2" : "fA1"];

      const tokenType = {
        [fa2 ? "fa2" : "fa1"]: true,
      };
      const rewardTokenType = {
        [rewardFa2 ? "fa2" : "fa1"]: true,
      };

      if (token) {
        delete Object.assign(token, { address: token.token }).token;
        delete Object.assign(token, { tokenId: token.id }).id;
      }

      if (rewToken) {
        delete Object.assign(rewToken, { address: rewToken.token }).token;
        delete Object.assign(rewToken, { tokenId: rewToken.id }).id;
      }

      const poolToken = {
        is_vl_lp: farmValue.stake_params.is_v1_lp,
        isQuipuLp: farmValue.stake_params.is_v1_lp,
        tokenType,
        ...token,
      };

      const rewardToken = {
        is_vl_lp: farmValue.reward_token.is_v1_lp || false,
        isQuipuLp: farmValue.reward_token.is_v1_lp || false,
        tokenType: rewardTokenType,
        ...rewToken,
      };

      const stakeData = {
        ...userFarmValue,
        id: userFarm.key.nat,
        endTime: farmValue?.end_time,
        startTime: farmValue?.start_time,
        ended,
        started,
        poolToken,
        rewardToken,
        depositValue: 0,
        depositValueUsd: 0,
        rewardValue: 0,
        rewardValueUsd: 0,
        totalValue: 0,
        totalValueUsd: 0,
      };

      const poolTokenMeta = teztools.findTokenInPriceFeed(
        stakeData.poolToken,
        priceFeed
      );

      const rewardTokenMeta = teztools.findTokenInPriceFeed(
        stakeData.rewardToken,
        priceFeed
      );

      if (poolTokenMeta.address === stakeData.poolToken.address) {
        poolTokenMeta.pairs = poolTokenMeta.pairs.filter(
          (val) => val.address === stakeData.poolToken.address
        );
      }
      // console.log("userFarmValue", userFarmValue);

      const pendingRewards = calcQuipuPendingReward(farmValue, userFarmValue);

      const rewardsEarned = new BigNumber(pendingRewards)
        .div(new BigNumber(10).pow(rewardTokenMeta.decimals))
        .toNumber();

      console.log("rewardsEarned", rewardsEarned);

      delete Object.assign(stakeData, {
        depositAmount: stakeData.poolToken.is_vl_lp
          ? new BigNumber(stakeData.staked)
              .div(new BigNumber(10).pow(6))
              .toNumber()
          : new BigNumber(stakeData.staked)
              .div(new BigNumber(10).pow(poolTokenMeta.decimals))
              .toNumber(),
      }).staked;

      Object.assign(stakeData, {
        rewardsEarned: stakeData.rewardToken.is_vl_lp
          ? new BigNumber(stakeData.earned)
              .div(new BigNumber(10).pow(6))
              .toNumber()
          : new BigNumber(stakeData.earned)
              .div(new BigNumber(10).pow(rewardTokenMeta.decimals))
              .toNumber(),
      });

      userStake.push(
        merge(stakeData, {
          poolToken: {
            ...poolTokenMeta,
          },
          rewardToken: {
            ...rewardTokenMeta,
          },
        })
      );
    }

    const stakeData = await sumStake(userStake);
    console.log(stakeData);
    return stakeData;
  },
};
