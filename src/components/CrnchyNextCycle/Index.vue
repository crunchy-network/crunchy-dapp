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
              </h2>
              <el-row :gutter="24">
                <el-col :span="8">
                  <h2 class="stake-text_small">Total Staked</h2>
                  <h2 class="stake-text_big">5,000</h2>
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
                    80%
                    <small
                      style="
                        font-weight: 500;
                        font-size: 12px;
                        color: var(--link-btn-color);
                      "
                      >Increase</small
                    >
                  </h2>
                </el-col>
                <el-col :span="8">
                  <h2 class="stake-text_small">crVOTE Received</h2>
                  <h2 class="stake-text_big">4,400</h2>
                </el-col>
              </el-row>
              <el-row style="margin-top: 24px" :gutter="24">
                <el-col :span="8">
                  <h2 class="stake-text_small">CRNCHY Unlocks</h2>
                  <h2 class="stake-text_big">1.4 yrs</h2>
                  <h2 class="stake-text_small" style="font-size: 12px">
                    03 MAR 2024 14:23 UTC
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
                      vueNumberFormat(5000, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 0,
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
                      vueNumberFormat(12.2, {
                        prefix: "",
                        suffix: "%",
                        decimal: ".",
                        thousand: ",",
                        precision: 1,
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
                  <h2 class="stake-text_small">Claimable Rewards</h2>
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
                      vueNumberFormat(2.21, {
                        prefix: "",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
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
                  disabled
                  style="
                    font-weight: 700;
                    min-width: 160px;
                    text-transform: uppercase;
                  "
                  >Claim Rewards
                </el-button>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <crnchy-staking-dialog
      ref="nextStakeRestakeDialog"
      :set-dialog-tab="setDialogTab"
      :dialog-tab="dialogTab"
    />
    <crnchy-unstake-dialog ref="nextClaimDialog" />
  </el-row>
</template>

<script>
import CrnchyUnstakeDialog from "./CrnchyUnstakeDialog.vue";
import CrnchyStakingDialog from "./CrnchyStakingDialog.vue";
export default {
  name: "CrnchyStakingNextCycle",
  components: { CrnchyStakingDialog, CrnchyUnstakeDialog },
  data() {
    return {
      dialogTab: "stake",
    };
  },
  methods: {
    showCreateDialog() {
      this.$refs.nextStakeRestakeDialog.showDialog();
    },
    showUnstakeDialog() {
      this.$refs.nextClaimDialog.showDialog();
    },
    setDialogTab(tab) {
      this.dialogTab = tab;
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
</style>
