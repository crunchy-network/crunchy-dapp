<template>
  <el-row class="main-row" :gutter="40" type="flex" style="flex-wrap: wrap">
    <el-col>
      <div>
        <el-row
          class="staking-details-row"
          style="flex-wrap: wrap; margin-top: 20px; row-gap: 40px"
          :gutter="40"
          type="flex"
        >
          <el-col :md="12">
            <el-card
              v-loading="crnchyStaking.loading"
              style="height: 100%"
              class="_with-bg-image"
              body-style="height: 100%; display: flex; flex-direction: column; box-sizing: border-box; padding-bottom: 32px"
            >
              <h2
                style="
                  font-weight: 700 !important;
                  font-size: 16px;
                  margin-bottom: 16px;
                "
              >
                My Staking Summary
                <span class="muted fs__12" style="float: right"
                  >Cycle # {{ selectedCycle.cycleId }}
                  {{ selectedCycle.starts | moment("MMM DD YYYY HH:mm") }} -
                  {{ selectedCycle.ends | moment("MMM DD YYYY HH:mm") }}</span
                >
              </h2>
              <el-row
                v-if="
                  crnchyStaking.myStaking.currentCycle.stakingPower > 0 ||
                  crnchyStaking.myStaking.nextCycle.stakingPower > 0
                "
                :gutter="24"
              >
                <el-col :span="8">
                  <h2 class="stake-text_small">Total Staked</h2>
                  <h2 class="stake-text_big">
                    {{
                      vueNumberFormat(myStakingSelectedCycle.deposit, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                  </h2>
                </el-col>
                <el-col :span="8">
                  <h2 class="stake-text_small">
                    Staking Power
                    <el-tooltip
                      content="Staking power is based on length of lockup"
                      placement="top"
                      effect="light"
                    >
                      <i
                        style="color: var(--primary-text)"
                        class="fas fa-question-circle"
                      ></i>
                    </el-tooltip>
                  </h2>
                  <h2 class="stake-text_big">
                    {{
                      vueNumberFormat(myStakingPowerPct, {
                        prefix: "",
                        suffix: "%",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                    <el-button
                      v-if="myStakingPowerPct < 100 && activeTab !== 'current'"
                      type="text"
                      style="font-weight: 500; font-size: 12px"
                      @click="showRestakeDialog"
                      >Increase</el-button
                    >
                  </h2>
                </el-col>
                <el-col :span="8">
                  <h2 class="stake-text_small">crVOTE Received</h2>
                  <h2 class="stake-text_big">
                    {{
                      vueNumberFormat(myStakingSelectedCycle.issued, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                  </h2>
                </el-col>
              </el-row>

              <el-row
                v-if="crnchyStaking.loading"
                style="margin-top: 24px"
                :gutter="24"
              >
                <el-col></el-col>
              </el-row>
              <el-row
                v-else-if="
                  crnchyStaking.myStaking.currentCycle.stakingPower > 0 ||
                  crnchyStaking.myStaking.nextCycle.stakingPower > 0
                "
                style="margin-top: 24px"
                :gutter="24"
              >
                <el-col v-if="myLockEndsMs > 0" :span="8">
                  <h2 class="stake-text_small">CRNCHY Unlocks</h2>
                  <h2 class="stake-text_big">
                    {{
                      myLockEndsMs
                        | humanizeDuration({ maxDecimalPoints: 0, largest: 2 })
                    }}
                  </h2>
                  <h2 class="stake-text_small" style="font-size: 12px">
                    {{
                      crnchyStaking.myStaking.lockEndTime
                        | moment("MMM DD YYYY HH:mm Z")
                    }}
                  </h2>
                </el-col>
                <el-col v-else :span="8">
                  <h2 class="stake-text_small">CRNCHY Unlocked</h2>
                  <h2 class="stake-text_big">
                    <el-button
                      type="text"
                      style="font-weight: 500; font-size: 12px"
                      @click="showRestakeDialog"
                      >Re-Stake</el-button
                    >
                  </h2>
                </el-col>
              </el-row>
              <el-row v-else style="margin-top: 24px" :gutter="24">
                <el-col>
                  <h2
                    class="stake-text_medium muted"
                    style="text-align: center"
                  >
                    Stake your CRNCHY to see your staking summary and see
                    potential rewards.
                  </h2>
                </el-col>
              </el-row>

              <div style="margin-top: 41px"></div>
              <div style="margin-top: auto">
                <el-row
                  style="margin-top: auto"
                  type="flex"
                  justify="center"
                  :gutter="24"
                >
                  <el-button
                    v-if="
                      crnchyStaking.myStaking.currentCycle.stakingPower > 0 ||
                      crnchyStaking.myStaking.nextCycle.stakingPower > 0
                    "
                    round
                    plain
                    type="primary"
                    style="
                      background: #eeefff;
                      color: #555cff;
                      font-weight: 700;
                      text-transform: uppercase;
                    "
                    @click="showUnstakeDialog"
                    >Un-stake
                  </el-button>
                  <el-button
                    round
                    type="primary"
                    style="font-weight: 700; text-transform: uppercase"
                    @click="showCreateDialog"
                    >stake
                  </el-button>
                </el-row>
              </div>
            </el-card>
          </el-col>
          <el-col :md="12">
            <el-card
              v-loading="crnchyStaking.loading"
              style="height: 100%"
              body-style="height: 100%; display: flex; flex-direction: column; box-sizing: border-box; padding-bottom: 32px"
            >
              <h2
                style="
                  font-weight: 700 !important;
                  font-size: 16px;
                  margin-bottom: 16px;
                "
              >
                Staking Rewards
              </h2>
              <el-row :gutter="24">
                <el-col :span="8">
                  <h2 class="stake-text_small">
                    Pool Rewards
                    <el-tooltip
                      content="Rewards from the pool"
                      placement="top"
                      effect="light"
                    >
                      <i
                        style="color: var(--primary-text)"
                        class="fas fa-question-circle"
                      ></i>
                    </el-tooltip>
                  </h2>
                  <h2
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: start;
                      margin-top: 6px;
                    "
                    class="stake-text_big"
                  >
                    {{
                      vueNumberFormat(selectedCycle.totalRewards, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 4,
                      })
                    }}
                    <el-avatar
                      shape="circle"
                      :size="24"
                      style="margin-left: 5px; background: transparent"
                      src="https://res.cloudinary.com/melvin-manni/image/upload/v1677920267/gtdqpxe3oflwbpwnzdqd.png"
                    >
                    </el-avatar>
                  </h2>
                </el-col>
                <el-col :span="8">
                  <h2 class="stake-text_small">
                    Pool Ownership
                    <el-tooltip
                      content="Percentage of the total pool owned by you"
                      placement="top"
                      effect="light"
                    >
                      <i
                        style="color: var(--primary-text)"
                        class="fas fa-question-circle"
                      ></i>
                    </el-tooltip>
                  </h2>
                  <h2 style="margin-top: 6px" class="stake-text_big">
                    {{
                      vueNumberFormat(cycleOwnershipPct, {
                        prefix: "",
                        suffix: "%",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    }}
                  </h2>
                </el-col>
                <el-col :span="8">
                  <h2 class="stake-text_small">Current APR</h2>
                  <h2 style="margin-top: 6px" class="stake-text_big">
                    {{
                      vueNumberFormat(36, {
                        prefix: "",
                        suffix: "%",
                        decimal: ".",
                        thousand: ",",
                        precision: 0,
                      })
                    }}
                  </h2>
                </el-col>
              </el-row>
              <el-row style="margin-top: 24px" :gutter="24">
                <el-col :span="8">
                  <h2 v-if="activeTab === 'current'" class="stake-text_small">
                    Claimable Rewards
                  </h2>
                  <h2 v-else class="stake-text_small">Estimated Rewards</h2>
                  <h2
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: start;
                      margin-top: 6px;
                    "
                    class="stake-text_big"
                  >
                    {{
                      vueNumberFormat(myStakingSelectedCycle.pendingHarvest, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 4,
                      })
                    }}
                    <el-avatar
                      shape="circle"
                      :size="24"
                      style="margin-left: 5px; background: transparent"
                      src="https://res.cloudinary.com/melvin-manni/image/upload/v1677920267/gtdqpxe3oflwbpwnzdqd.png"
                    >
                    </el-avatar>
                  </h2>
                </el-col>
              </el-row>
              <div style="margin-top: 41px"></div>
              <el-row style="margin-top: auto" type="flex" justify="center">
                <el-button
                  round
                  type="primary"
                  :disabled="
                    activeTab !== 'current' ||
                    crnchyStaking.myStaking.currentCycle.stakingPower === 0
                  "
                  style="
                    font-weight: 700;
                    min-width: 160px;
                    text-transform: uppercase;
                  "
                  @click="harvestCrnchyStaking"
                  >Claim Rewards
                </el-button>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <crnchy-staking-dialog ref="stakeRestakeDialog" />
    <crnchy-unstake-dialog ref="claimDialog" />
  </el-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import CrnchyUnstakeDialog from "./CrnchyUnstakeDialog.vue";
import CrnchyStakingDialog from "./CrnchyStakingDialog.vue";

export default {
  name: "CrnchyStakingCycle",
  components: { CrnchyStakingDialog, CrnchyUnstakeDialog },
  props: {
    activeTab: {
      type: String,
      default: "current",
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["wallet", "crnchyStaking"]),
    ...mapGetters(["currentCycle"]),

    selectedCycle: function () {
      return this.activeTab === "current"
        ? this.crnchyStaking.currentCycle
        : this.crnchyStaking.nextCycle;
    },

    myStakingSelectedCycle: function () {
      return this.activeTab === "current"
        ? this.crnchyStaking.myStaking.currentCycle
        : this.crnchyStaking.myStaking.nextCycle;
    },

    cycleOwnershipPct: function () {
      return (
        (this.myStakingSelectedCycle.deposit /
          this.selectedCycle.totalDeposit) *
        100
      );
    },

    myStakingPowerPct: function () {
      return (
        this.crnchyStaking.settings.stakingPowerMap[
          this.myStakingSelectedCycle.stakingPower
        ] || 0
      );
    },

    myLockEndsMs: function () {
      return (
        this.crnchyStaking.myStaking.lockEndTime.getTime() -
        new Date().getTime()
      );
    },
  },
  methods: {
    ...mapActions([
      "connectWallet",
      "disconnectWallet",
      "harvestCrnchyStaking",
    ]),

    showCreateDialog() {
      this.$refs.stakeRestakeDialog.showDialog("stake");
    },
    showRestakeDialog() {
      this.$refs.stakeRestakeDialog.showDialog("restake");
    },
    showUnstakeDialog() {
      this.$refs.claimDialog.showDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  min-height: unset;
}

.main-row {
  > .el-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }

  @media (max-width: 991px) {
    flex-direction: column;
    > .el-col:nth-child(2) {
      margin-top: 50px;
    }
  }
}
.grid-row .el-col {
  margin-bottom: 10px;
}

.staking-details-row .el-col {
  display: flex;
  flex-direction: column;
}

.stake-text_small {
  color: var(--color-subheading-text);
  font-size: 12px;
  font-weight: 700 !important;
  margin-bottom: 0px;
}
.stake-text_big {
  color: var(--primary-text);
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0px;
}
.stake-text_medium {
  color: var(--primary-text);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0px;
}
.muted {
  color: var(--color-subheading-text);
}
</style>
