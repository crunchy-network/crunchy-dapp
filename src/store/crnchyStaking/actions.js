import tzkt from "./../../utils/tzkt";
import { getBatch, getContract, getWalletContract } from "./../../utils/tezos";
import dexIndexer from "./../../utils/dex-indexer";
import { BigNumber } from "bignumber.js";

export default {
  async refreshCrnchyStakingData({
    rootState,
    state,
    commit,
    getters,
    dispatch,
  }) {
    commit("updateCrnchyStakingLoading", true);

    const [
      stakingStorage,
      stakingCycles,
      stakingLedger,
      totalCrvoteIssued,
      totalCrnchy,
    ] = await Promise.all([
      tzkt.getContractStorage(state.contract).then((resp) => resp.data),
      tzkt
        .getContractBigMapKeys(state.contract, "cycles", {
          active: "true",
          select: "value",
          limit: 1000,
        })
        .then((resp) => resp.data),
      tzkt
        .getContractBigMapKeys(state.contract, "ledger", {
          active: "true",
          select: "value",
          limit: 10000,
        })
        .then((resp) => resp.data),
      tzkt
        .getContractBigMapKeys(state.crvoteAddress, "token_total_supply", {
          key: "0",
          select: "value",
        })
        .then((resp) =>
          resp.data && resp.data.length
            ? BigNumber(resp.data[0]).div(BigNumber(10).pow(8)).toNumber()
            : 0
        ),
      tzkt
        .getContractBigMapKeys(state.crnchyAddress, "token_total_supply", {
          key: "0",
          select: "value",
        })
        .then((resp) =>
          resp.data && resp.data.length
            ? BigNumber(resp.data[0]).div(BigNumber(10).pow(8)).toNumber()
            : 0
        ),
    ]);

    // update some raw storage values
    const powerMap = { 0: 0 };
    for (const [t, p] of Object.entries(
      stakingStorage.settings.staking_power
    )) {
      powerMap[t] = BigNumber(p)
        .div(BigNumber(10).pow(8))
        .times(100)
        .toNumber();
    }

    const settings = {
      cycleDuration: parseInt(stakingStorage.settings.cycle_duration) * 1000,
      cycleGenesis: new Date(stakingStorage.settings.cycle_genesis),
      stakingPowerMap: powerMap,
    };
    commit("updateCrnchyStakingSettings", settings);

    // some helper functions
    const getCycle = (cycleId) =>
      stakingCycles.find((el) => parseInt(el.cycle_id) === cycleId) || {
        cycle_id: cycleId.toString(),
        total_issued: "0",
        total_deposit: "0",
        total_rewards: "0",
      };

    const getCycleEnd = (cycle) =>
      new Date(
        settings.cycleGenesis.getTime() +
          (cycle + 1) * settings.cycleDuration -
          1000
      );
    const getCycleStart = (cycle) =>
      new Date(
        settings.cycleGenesis.getTime() + cycle * settings.cycleDuration
      );

    // sync cycles
    const currentCycle = getters.currentCycle;
    let currentStorageCycle = parseInt(stakingStorage.current_cycle);
    while (currentStorageCycle !== currentCycle) {
      const newCurrentCycle = getCycle(currentStorageCycle + 1);
      const newNextCycle = getCycle(currentStorageCycle + 2);
      newNextCycle.total_deposit = newCurrentCycle.total_deposit;
      newNextCycle.total_issued = newCurrentCycle.total_issued;
      stakingCycles.push(newNextCycle);
      currentStorageCycle++;
    }

    // Update current cycle
    const currentCycleObj = {
      cycleId: currentCycle,
      totalIssued: BigNumber(getCycle(currentCycle).total_issued)
        .div(BigNumber(10).pow(8))
        .toNumber(),
      totalDeposit: BigNumber(getCycle(currentCycle).total_deposit)
        .div(BigNumber(10).pow(8))
        .toNumber(),
      totalRewards: BigNumber(getCycle(currentCycle).total_rewards)
        .div(BigNumber(10).pow(6))
        .toNumber(),
      starts: getCycleStart(currentCycle),
      ends: getCycleEnd(currentCycle),
    };
    commit("updateCrnchyStakingCurrentCycle", currentCycleObj);

    // Update next cycle
    const nextCycleObj = {
      cycleId: currentCycle + 1,
      totalIssued: BigNumber(getCycle(currentCycle + 1).total_issued)
        .div(BigNumber(10).pow(8))
        .toNumber(),
      totalDeposit: BigNumber(getCycle(currentCycle + 1).total_deposit)
        .div(BigNumber(10).pow(8))
        .toNumber(),
      totalRewards: BigNumber(getCycle(currentCycle + 1).total_rewards)
        .div(BigNumber(10).pow(6))
        .toNumber(),
      starts: getCycleStart(currentCycle + 1),
      ends: getCycleEnd(currentCycle + 1),
    };
    commit("updateCrnchyStakingNextCycle", nextCycleObj);

    // update summary
    const totalRewardsAvail = stakingCycles
      .reduce((accum, cycle) => accum.plus(cycle.total_rewards), BigNumber(0))
      .div(BigNumber(10).pow(6))
      .toNumber();

    let avgLockTimeMs = 0;
    if (stakingLedger.length) {
      avgLockTimeMs = stakingLedger
        .reduce(
          (accum, entry) => accum.plus(entry.next_cycle.staking_power),
          BigNumber(0)
        )
        .div(stakingLedger.length)
        .times(1000)
        .toNumber();
    }

    const summary = {
      totalCrnchy,
      totalCrnchyStaked: nextCycleObj.totalDeposit,
      totalCrvoteIssued,
      totalRewardsAvail,
      avgLockTimeMs,
    };

    commit("updateCrnchyStakingSummary", summary);

    if (rootState.wallet.pkh) {
      const [myStakingLedger, crnchyToken, wtzToken] = await Promise.all([
        tzkt
          .getContractBigMapKeys(state.contract, "ledger", {
            active: "true",
            select: "value",
            key: rootState.wallet.pkh,
          })
          .then((resp) =>
            resp.data && resp.data.length ? resp.data[0] : null
          ),
          dexIndexer.getToken(process.env.VUE_APP_CONTRACTS_CRNCHY, "0"),
          dexIndexer.getToken(process.env.VUE_APP_CONTRACTS_WTZ_FA2, "0"),
      ]);

      const crnchyPriceTez = Number(crnchyToken[0]?.quotes.find(el => el.token.tokenAddress === "tez")?.quote);
      const wtzPriceTez = Number(wtzToken[0]?.quotes.find(el => el.pool.dex.type === 'wtz')?.quote || 1);

      if (myStakingLedger) {
        // sync cycles for my ledger
        let pendingHarvest = 0;

        let myCurrentCycleObj = {
          cycleId: parseInt(myStakingLedger.current_cycle.cycle_id),
          issued: BigNumber(myStakingLedger.current_cycle.issued)
            .div(BigNumber(10).pow(8))
            .toNumber(),
          deposit: BigNumber(myStakingLedger.current_cycle.deposit)
            .div(BigNumber(10).pow(8))
            .toNumber(),
          amountHarvested: BigNumber(
            myStakingLedger.current_cycle.amount_harvested
          )
            .div(BigNumber(10).pow(6))
            .toNumber(),
          stakingPower: parseInt(myStakingLedger.current_cycle.staking_power),
          pendingHarvest: 0,
          apr: 0,
        };

        const myNextCycleObj = {
          cycleId: parseInt(myStakingLedger.next_cycle.cycle_id),
          issued: BigNumber(myStakingLedger.next_cycle.issued)
            .div(BigNumber(10).pow(8))
            .toNumber(),
          deposit: BigNumber(myStakingLedger.next_cycle.deposit)
            .div(BigNumber(10).pow(8))
            .toNumber(),
          amountHarvested: 0,
          stakingPower: parseInt(myStakingLedger.next_cycle.staking_power),
          pendingHarvest: 0,
          apr: 0,
        };

        while (myCurrentCycleObj.cycleId < currentCycle) {
          if (myCurrentCycleObj.issued > 0) {
            const thisCycle = getCycle(myCurrentCycleObj.cycleId);
            const rewardsAllocation = BigNumber(myCurrentCycleObj.issued)
              .times(
                BigNumber(thisCycle.total_rewards).div(BigNumber(10).pow(6))
              )
              .div(BigNumber(thisCycle.total_issued).div(BigNumber(10).pow(8)))
              .toNumber();
            pendingHarvest +=
              rewardsAllocation - myCurrentCycleObj.amountHarvested;
          }

          myCurrentCycleObj = { ...myNextCycleObj };
          myNextCycleObj.cycleId += 1;
        }

        let myCurrentCycleApr = 0;

        if (myCurrentCycleObj.issued > 0 && currentCycleObj.totalRewards > 0) {
          const rps =
            currentCycleObj.totalRewards /
            parseInt(stakingStorage.settings.cycle_duration);
          const rewardsAllocation = BigNumber(myCurrentCycleObj.issued)
            .times(rps)
            .div(currentCycleObj.totalIssued);
          const numSec =
            (new Date().getTime() -
              getters.cycleStart(currentCycle).getTime()) /
            1000;
          const currHarvest = rewardsAllocation
            .times(numSec)
            .minus(myCurrentCycleObj.amountHarvested)
            .toNumber();
          if (currHarvest > 0) {
            pendingHarvest += currHarvest;
          }

          const thisCycleTotalHarvest = BigNumber(myCurrentCycleObj.issued)
            .times(currentCycleObj.totalRewards)
            .div(currentCycleObj.totalIssued)
            .toNumber();
          if (thisCycleTotalHarvest > 0) {
            const annualRewardTez = thisCycleTotalHarvest * (31449600 / parseInt(stakingStorage.settings.cycle_duration)) * wtzPriceTez;
            myCurrentCycleApr = (annualRewardTez / (myCurrentCycleObj.deposit * crnchyPriceTez)) * 100;
          }
        }

        myCurrentCycleObj.pendingHarvest = pendingHarvest;
        myCurrentCycleObj.apr = myCurrentCycleApr;

        let futureHarvest = 0;
        let futureApr = 0;
        if (myNextCycleObj.issued > 0 && nextCycleObj.totalRewards > 0) {
          futureHarvest = BigNumber(myNextCycleObj.issued)
            .times(nextCycleObj.totalRewards)
            .div(nextCycleObj.totalIssued)
            .toNumber();

          if (futureHarvest > 0) {
            const annualRewardTez = futureHarvest * (31449600 / parseInt(stakingStorage.settings.cycle_duration)) * wtzPriceTez;
            futureApr = (annualRewardTez / (myNextCycleObj.deposit * crnchyPriceTez)) * 100;
          }
        }

        myNextCycleObj.pendingHarvest = futureHarvest;
        myNextCycleObj.apr = futureApr;

        commit("updateCrnchyMyStaking", {
          crnchyBalance: await dispatch("getCrnchyBalance"),
          lockEndTime: new Date(myStakingLedger.lock_end_time),
          currentCycle: myCurrentCycleObj,
          nextCycle: myNextCycleObj,
        });
      } else {
        const currentAnnualRewardTez = currentCycleObj.totalRewards * (31449600 / parseInt(stakingStorage.settings.cycle_duration)) * wtzPriceTez;
        const currentApr = (currentAnnualRewardTez / (currentCycleObj.totalDeposit * crnchyPriceTez)) * 100;

        const nextAnnualRewardTez = nextCycleObj.totalRewards * (31449600 / parseInt(stakingStorage.settings.cycle_duration)) * wtzPriceTez;
        const nextApr = (nextAnnualRewardTez / (nextCycleObj.totalDeposit * crnchyPriceTez)) * 100;

        commit("updateCrnchyMyStaking", {
          crnchyBalance: await dispatch("getCrnchyBalance"),
          lockEndTime: new Date(),
          currentCycle: {
            cycleId: 0,
            issued: 0,
            deposit: 0,
            stakingPower: 0,
            pendingHarvest: 0,
            apr: currentApr,
          },
          nextCycle: {
            cycleId: 0,
            issued: 0,
            deposit: 0,
            stakingPower: 0,
            pendingHarvest: 0,
            apr: nextApr,
          },
        });
      }
    }

    commit("updateCrnchyStakingLoading", false);
  },

  async getCrnchyBalance({ state, rootState }) {
    return tzkt
      .getContractBigMapKeys(state.crnchyAddress, "ledger", {
        "key.address": rootState.wallet.pkh,
        active: "true",
      })
      .then((tokenLedger) => {
        let tokenBal = BigNumber(0);
        if (tokenLedger.data.length) {
          tokenBal = BigNumber(tokenLedger.data[0].value).div(
            BigNumber(10).pow(8)
          );
        }
        return tokenBal.toNumber();
      });
  },

  async harvestCrnchyStaking({ state, commit, dispatch }) {
    const stakingContract = await getWalletContract(state.contract);
    stakingContract.methods
      .harvest()
      .send()
      .then((tx) => {
        commit("updateCrnchyStakingLoading", true);
        tx.confirmation().then(() => {
          dispatch("refreshCrnchyStakingData");
        });
      });
  },

  async stakeCrnchyStaking({ state, rootState, commit, dispatch }, payload) {
    const { stakingPower, amount } = payload;
    const stakingContract = await getContract(state.contract);
    const crnchyContract = await getContract(state.crnchyAddress);

    const amountB = BigNumber(amount)
      .times(BigNumber(10).pow(8))
      .idiv(1)
      .toNumber();

    const batch = await getBatch()
      .withContractCall(stakingContract.methods.harvest())
      .withContractCall(
        crnchyContract.methodsObject.update_operators([
          {
            add_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: "0",
            },
          },
        ])
      )
      .withContractCall(
        stakingContract.methodsObject.stake({
          amount: amountB,
          staking_power: stakingPower,
        })
      )
      .withContractCall(
        crnchyContract.methodsObject.update_operators([
          {
            remove_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: "0",
            },
          },
        ])
      );

    const tx = await batch.send();
    await tx.confirmation();
    dispatch("refreshCrnchyStakingData");
  },

  async unstakeCrnchyStaking({ state, rootState, commit, dispatch }, payload) {
    const { amount } = payload;
    const stakingContract = await getContract(state.contract);
    const crvoteContract = await getContract(state.crvoteAddress);

    const amountB = BigNumber(amount)
      .times(BigNumber(10).pow(8))
      .idiv(1)
      .toNumber();

    const batch = await getBatch()
      .withContractCall(stakingContract.methods.harvest())
      .withContractCall(
        crvoteContract.methodsObject.update_operators([
          {
            add_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: "0",
            },
          },
        ])
      )
      .withContractCall(stakingContract.methods.unstake(amountB))
      .withContractCall(
        crvoteContract.methodsObject.update_operators([
          {
            remove_operator: {
              owner: rootState.wallet.pkh,
              operator: state.contract,
              token_id: "0",
            },
          },
        ])
      );

    const tx = await batch.send();
    await tx.confirmation();
    dispatch("refreshCrnchyStakingData");
  },

  async walletConnected({ dispatch }) {
    dispatch("refreshCrnchyStakingData");
  },
};
