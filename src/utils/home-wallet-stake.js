import BigNumber from "bignumber.js";
import ipfs from "./ipfs";
import teztools from "./teztools";
import tzkt from "./tzkt";

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
  let value = 0;
  if (multiplier) {
    // Initialize variables

    value += claimableXTZ;

    if (userTier === Number(revenueTier)) {
      value += ((xtzPerGif - lastXtzPerGif) * userGif) / multiplier;

      if (
        currentCycle &&
        Date.now() < new Date(currentCycle?.end_time).getTime()
      ) {
        value +=
          (new BigNumber(currentCycle.xtz_per_sec).toNumber() *
            ((Date.now() - new Date(lastUpdate).getTime()) / 1e3) *
            userGif) /
          (totalGif * multiplier);
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
      const xtzUsd = await tzkt.getXtzUsdPrice();

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
      (val) => val?.value.rewardDebt !== "0" || val?.value.amount !== "0"
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

    console.log("userStakes", userStake);

    const stakeData = await sumStake(userStake);

    return stakeData;
  },

  // async getUsersQuipusStake(pkh, priceFeed) {
  //   const userQuipuStakes = await getUserQuipuLp(pkh);
  //   for (let i = 0; i < userQuipuStakes.length; i++) {
  //     const stake = userQuipuStakes[i];

  //     const token = {
  //       tokenAddress: stake.tokenAddress,
  //       address: stake.address,
  //       tokenId: stake.tokenId,
  //       tokenType: {
  //         fa2: true,
  //       },
  //     };

  //     const tokenMetaData = await teztools.findTokenInPriceFeed(
  //       token,
  //       priceFeed
  //     );

  //     tokenMetaData.pairs = tokenMetaData.pairs.filter(
  //       (val) => val.address === stake.address
  //     );

  //     stake.depositAmount = new BigNumber(stake.ledger.balance)
  //       .div(new BigNumber(10).pow(6))
  //       .toNumber();

  //     stake.rewardValue = "-";

  //     stake.rewardValueUsd = "-";
  //     tokenMetaData.isQuipuLp = true;

  //     userQuipuStakes[i] = {
  //       ...stake,
  //       poolToken: tokenMetaData,
  //       depositValue: 0,
  //       depositValueUsd: 0,
  //       totalValue: 0,
  //       totalValueUsd: 0,
  //     };
  //   }

  //   const stakeData = await sumStake(userQuipuStakes);
  //   return stakeData;
  // },

  async getDogamiStake(pkh) {
    const userStakes = [];

    const { data: dogami } = await tzkt.getContractStorage(
      process.env.VUE_APP_DOGAMI_STAKE
    );

    const [tokenMetaData, { data: dataObjs }, { data: stakeLockPack }] =
      await Promise.all([
        teztools.getTokenPrice(`${dogami.FA12TokenContract}`),
        await tzkt.getContractBigMapKeys(
          process.env.VUE_APP_DOGAMI_STAKE,
          "addressId",
          { key: pkh, active: "true" }
        ),
        await tzkt.getContractBigMapKeys(
          process.env.VUE_APP_DOGAMI_STAKE_2,
          "userStakeLockPack",
          { key: pkh, active: "true" }
        ),
      ]);

    console.log("Got Here...", tokenMetaData);

    if (dataObjs.length > 0) {
      const [{ value: addressId }] = dataObjs;

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
          { key: addressId, active: "true" }
        );

        const userStake = stake[pkh];
        const depositAmount = new BigNumber(userStake?.value)
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
          apr: 8,
        });
      }
    }

    if (stakeLockPack.length > 0) {
      const [{ value: userStakeLock }] = stakeLockPack;

      if (tokenMetaData.thumbnailUri) {
        tokenMetaData.thumbnailUri = ipfs.transformUri(
          tokenMetaData.thumbnailUri
        );
      }

      for (const key in userStakeLock[1]) {
        const stake = userStakeLock[1][key];

        const depositAmount = new BigNumber(stake?.value)
          .div(new BigNumber(10).pow(tokenMetaData.decimals))
          .toNumber();
        // const rewardsEarned = new BigNumber(userStake.reward)
        //   .div(new BigNumber(10).pow(tokenMetaData.decimals))
        //   .toNumber();

        userStakes.push({
          ...dogami,
          poolToken: tokenMetaData,
          rewardToken: tokenMetaData,
          depositAmount,
          rewardsEarned: 0,
          depositValue: 0,
          depositValueUsd: 0,
          rewardValue: 0,
          rewardValueUsd: 0,
          totalValue: 0,
          totalValueUsd: 0,
          apr: 33,
        });
      }
    }

    const stakeData = await sumStake(userStakes);
    return stakeData;
  },

  async getGIFStake(pkh) {
    const userStakes = [];

    const { data: gif } = await tzkt.getContractStorage(
      process.env.VUE_APP_GIF_STAKE
    );

    const [poolToken, xtzUsd, { data: dataObjs }] = await Promise.all([
      teztools.getTokenPrice(`${gif.staking.gif.address}_0`),
      await tzkt.getXtzUsdPrice(),
      await tzkt.getContractBigMapKeys(
        process.env.VUE_APP_GIF_STAKE,
        "ledger",
        { key: pkh, active: "true" }
      ),
    ]);

    if (dataObjs.length > 0) {
      const [{ value: userStake }] = dataObjs;

      if (poolToken.thumbnailUri) {
        poolToken.thumbnailUri = ipfs.transformUri(poolToken.thumbnailUri);
      }

      const rewardToken = {
        currentPrice: 1,
        decimals: 6,
        usdValue: xtzUsd,
        thumbnailUri:
          "data:image/png;base64,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",
      };
      const revenue = gif.revenue;
      const revenueTier = new BigNumber(gif.staking.revenue_tier);

      if (userStake) {
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
        const userTier =
          Object.keys(userStake.tiers)
            .map((key) => {
              const value = userStake.tiers[key];
              if (new Date(value).getTime() > 0) {
                return key;
              }
            })
            .sort((a, b) => b - a)[0] || 0;

        rewardsEarned =
          calculateGIFRewards(
            claimableXTZ.toNumber(),
            multiplier.toNumber(),
            xtzPerGif.toNumber(),
            lastXtzPerGif.toNumber(),
            userGif.toNumber(),
            currentCycle,
            lastUpdate,
            totalGif.toNumber(),
            revenueTier.toNumber(),
            Number(userTier)
          ) / 1000000;
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
    }

    const stakeData = await sumStake(userStakes);
    return stakeData;
  },

  // NO Claimable
  sectionNotAvailable(protocol = "") {
    const protocols = ["dogami"];

    if (protocols.includes(protocol.toLowerCase())) {
      return "N/A";
    } else {
      return false;
    }
  },
};
