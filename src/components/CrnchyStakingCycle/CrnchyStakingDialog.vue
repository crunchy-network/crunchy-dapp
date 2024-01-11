<template>
  <el-dialog
    v-loading="submitDisabled"
    width="400px"
    :modal="true"
    :visible.sync="visible"
  >
    <div
      class="box-card"
      style="flex: 1; display: flex; flex-direction: column"
    >
      <div
        v-if="step !== 'success'"
        style="margin-bottom: 24px; display: flex; align-items: end"
      >
        <el-button
          class="text-btn"
          type="text"
          :style="
            tab === 'stake' &&
            'border-bottom-color: var(--color-menu-active); color: var(--color-menu-active);'
          "
          @click="switchDialogTab('stake')"
        >
          Stake
        </el-button>
        <el-button
          v-if="crnchyStaking.myStaking.nextCycle.deposit > 0"
          class="text-btn"
          type="text"
          :style="
            tab === 'restake' &&
            'border-bottom-color: var(--color-menu-active); color: var(--color-menu-active);'
          "
          @click="switchDialogTab('restake')"
        >
          Re-Stake
        </el-button>
      </div>

      <div v-if="step === 'success'">
        <h2 class="title">Stake Successful!</h2>
        <p
          style="
            margin-top: 16px;
            font-weight: 300 !important;
            font-size: 14px;
            line-height: normal;
            letter-spacing: normal;
            color: var(--color-subheading-text);
          "
        >
          Your CRNCHY tokens are staked and will be reflected in the "Next
          Cycle" tab.
        </p>
        <p
          style="
            margin-top: 16px;
            font-weight: 300 !important;
            font-size: 14px;
            line-height: normal;
            letter-spacing: normal;
            color: var(--color-subheading-text);
          "
        >
          Check your wallet for your crVOTE allocation. Don't lose that crVOTE.
          You must have it in your wallet when you are able to unstake your
          CRNCHY
        </p>
      </div>

      <div v-if="step === 'input'">
        <h2 class="title">
          <template v-if="tab === 'stake'">Stake CRNCHY</template>
          <template v-else>Re-Stake CRNCHY</template>
        </h2>
        <h2
          style="
            font-weight: 300 !important;
            font-size: 14px;
            line-height: 22px;
            letter-spacing: 0.02em;
            color: var(--color-subheading-text);
          "
        >
          <template v-if="tab === 'stake'">
            Stake CRNCHY to earn farm rewards and crVOTE to participate in DAO
            votes. If you already have staked CRNCHY, you must stake past your
            original stake date.
          </template>
          <template v-else>
            You can re-stake your CRNCHY to extend your staking time and gain
            more staking power.
          </template>
        </h2>
        <div
          v-if="tab === 'restake'"
          style="margin: 32px 0"
          class="_balance _info-card"
        >
          <p class="_info-card__title">Staked Balance:</p>
          <h2>
            {{
              vueNumberFormat(crnchyStaking.myStaking.nextCycle.deposit, {
                prefix: "",
                decimal: ".",
                thousand: ",",
                precision: 2,
              })
            }}
          </h2>
        </div>

        <div v-if="tab === 'stake'" id="crnchy-stake-input">
          <div
            style="
              text-align: right;
              padding-right: 18px;
              display: flex;
              align-items: flex-end;
              justify-content: end;
            "
          >
            <slot></slot>
            <div style="justify-self: flex-end">
              <p
                style="
                  font-weight: 500;
                  font-size: 12px;
                  color: var(--color-subheading-text);
                  display: inline;
                "
              >
                Balance:
                <span>{{
                  vueNumberFormat(crnchyStaking.myStaking.crnchyBalance, {
                    prefix: "",
                    decimal: ".",
                    thousand: ",",
                    precision: 4,
                  })
                }}</span>
              </p>
            </div>
          </div>
          <el-card
            style="width: 100%"
            body-style="padding: 12px 16px; display: flex; gap: 4px "
          >
            <div style="display: flex; align-items: center">
              <img
                shape="circle"
                src="../../assets/token-icons/crnchy.png"
                :size="30"
                class="img-style"
              />
              <span class="selected-asset-input">CRNCHY</span>
            </div>
            <el-input
              v-model="inputAmount"
              :class="`asset-swap-amount ${inputFontSize}`"
              type="number"
              min="0"
              placeholder="0"
              style="padding: 0"
            />
          </el-card>

          <div style="text-align: right; padding-right: 18px">
            <el-button
              style="
                padding: 0;
                margin-left: 16px;
                color: #555cff;
                font-weight: 500;
                font-size: 12px;
              "
              type="text"
              @click="
                () => (inputAmount = crnchyStaking.myStaking.crnchyBalance)
              "
              >Max</el-button
            >
          </div>
        </div>

        <div :style="tab === 'stake' && 'margin-top: 16px;'">
          <h2 style="color: var(--color-subheading-text)">
            <template v-if="tab === 'stake'"> Select a Lock Time </template>
            <template v-else> Extend Lock Time </template>
          </h2>
        </div>
        <el-row style="margin-top: 10px" :gutter="8">
          <el-col
            v-for="[lockTime, label] in Object.entries(lockOpts).reverse()"
            :key="lockTime"
            :span="8"
          >
            <button
              :disabled="lockTime < minLock"
              :class="['time-tag', lockTime == selectedLockTime && 'active']"
              type="button"
              @click="setLockTime(lockTime)"
            >
              {{ label }}
            </button>
          </el-col>
        </el-row>
      </div>

      <div v-if="step === 'confirm'">
        <template v-if="tab === 'stake'">
          <h2 class="title">Confirm CRNCHY Stake</h2>
          <p style="color: var(--color-subheading-text)">
            Please confirm your staking details below.
          </p>
        </template>
        <template v-else>
          <h2 class="title">Confirm CRNCHY Re-Stake</h2>
          <p style="color: var(--color-subheading-text)">
            Please confirm your re-staking details below.
          </p>
        </template>
        <el-row style="margin-top: 24px; margin-bottom: 8px">
          <el-col :span="12">
            <template v-if="tab === 'stake'">
              <p style="color: var(--color-subheading-text)" class="fw__7">
                CRNCHY Staked
              </p>
            </template>
            <template v-else>
              <p style="color: var(--color-subheading-text)" class="fw__7">
                CRNCHY to Re-Stake
              </p>
            </template>

            <number-format
              class-name="fs__18 fw__7"
              :value="finalInputAmount"
              :precision="2"
              :font-size="18"
              :short-hand="false"
            />
          </el-col>
          <el-col :span="12" style="text-align: right">
            <p style="color: var(--color-subheading-text)" class="fw__7">
              <span v-if="tab === 'restake'">New </span>Lock Time
            </p>
            <p class="fs__18 fw__7">{{ selectedLockTimeLabel }}</p></el-col
          >
        </el-row>
      </div>

      <div
        v-if="step !== 'success'"
        style="margin: 10px 0 32px 0"
        class="lock-display _info-card"
      >
        <small style="color: var(--primary-text)">
          Unlocks: {{ selectedLockTimeUnlocks | moment("MMM DD YYYY HH:mm Z") }}
        </small>
      </div>
      <div v-if="step !== 'success'" style="margin-bottom: 10px">
        <h2>
          <template v-if="tab === 'stake'">You Will Receive</template>
          <template v-else>After Re-Stake You Will Have</template>
        </h2>
      </div>

      <el-row
        v-if="step !== 'success'"
        :gutter="5"
        type="flex"
        justify="space-between"
        style="margin-top: 10px"
      >
        <div class="row">
          <small>crVOTE:</small>
          <h2 style="color: var(--primary-text)">
            {{
              vueNumberFormat(estimatedCrVote, {
                prefix: "",
                decimal: ".",
                thousand: ",",
                precision: 4,
              })
            }}
          </h2>
        </div>
        <div class="row">
          <small>Staking Power:</small>
          <h2 style="color: var(--primary-text)">
            {{
              vueNumberFormat(myStakingPowerPct, {
                prefix: "",
                suffix: "%",
                decimal: ".",
                thousand: ",",
                precision: 2,
              })
            }}
          </h2>
        </div>
      </el-row>

      <el-row
        v-if="step !== 'success'"
        style="margin-top: 32px"
        type="flex"
        justify="center"
      >
        <template v-if="step === 'input'">
          <el-button
            round
            type="primary"
            style="min-width: 50%"
            @click="setStep('confirm')"
          >
            <template v-if="tab === 'stake'"> Stake </template>
            <template v-else> Re-Stake </template>
          </el-button>
        </template>
        <template v-if="step === 'confirm'">
          <el-row type="flex" justify="center" style="gap: 40px">
            <el-button
              round
              type="primary"
              class="btn-alt__3"
              @click="setStep('input')"
            >
              Back
            </el-button>

            <el-button round type="primary" @click="submitStake">
              <template v-if="tab === 'stake'">Stake CRNCHY</template>
              <template v-else>Re-Stake CRNCHY</template>
            </el-button>
          </el-row>
        </template>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NumberFormat from "../NumberFormat.vue";

export default {
  name: "CrnchyStakingDialogue",
  components: { NumberFormat },
  data() {
    return {
      visible: false,
      submitDisabled: false,
      tab: "stake", // stake | restake
      step: "input", // input | confirm | success
      inputAmount: null,
      minLock: 0,
      selectedLockTime:
        process.env.VUE_APP_TEZOS_NETWORK === "ghostnet" ? 1209600 : 126144000,
      lockOpts:
        process.env.VUE_APP_TEZOS_NETWORK === "ghostnet"
          ? {
              1209600: "2 Weeks",
              604800: "1 Week",
              86400: "1 Day",
              21600: "6 Hours",
              10800: "3 Hours",
              3600: "1 Hour",
            }
          : {
              126144000: "4 Years",
              63072000: "2 Years",
              31536000: "1 Year",
              15768000: "6 Months",
              2628000: "1 Month",
              604800: "1 Week",
            },
    };
  },
  computed: {
    ...mapState(["crnchyStaking"]),

    selectedLockTimeLabel: function () {
      return this.lockOpts[this.selectedLockTime] || "Unknown";
    },
    selectedLockTimeUnlocks: function () {
      return new Date(
        new Date().getTime() + parseInt(this.selectedLockTime) * 1000
      );
    },
    estimatedCrVote: function () {
      return (this.finalInputAmount * this.myStakingPowerPct) / 100;
    },
    finalInputAmount: function () {
      return Number(
        this.tab === "restake"
          ? this.crnchyStaking.myStaking.nextCycle.deposit
          : this.inputAmount
      );
    },
    myStakingPowerPct: function () {
      return (
        this.crnchyStaking.settings.stakingPowerMap[this.selectedLockTime] || 0
      );
    },
    inputFontSize: function () {
      if (!this.inputAmount) {
        return "";
      }

      const inputLen = this.inputAmount.toString().length;
      if (inputLen > 15) {
        return "really-mini-font";
      }
      if (inputLen > 11) {
        return "mini-font";
      }

      return "";
    },
  },
  methods: {
    ...mapActions(["stakeCrnchyStaking"]),

    switchDialogTab(tab = "stake") {
      this.tab = tab;
    },

    setStep(step = "input") {
      this.step = step;
    },

    showDialog(tab = "stake") {
      this.submitDisabled = false;
      this.inputAmount = null;
      this.minLock = this.crnchyStaking.myStaking.nextCycle.stakingPower;
      if (tab === "restake" && this.minLock) {
        this.selectedLockTime = this.minLock;
      }
      this.setStep("input");
      this.switchDialogTab(tab);
      this.visible = true;
    },

    setLockTime(lockTime) {
      this.selectedLockTime = lockTime;
    },

    async submitStake() {
      try {
        this.submitDisabled = true;
        await this.stakeCrnchyStaking({
          amount: this.tab === "restake" ? 0 : this.inputAmount,
          stakingPower: this.selectedLockTime,
        });
        this.setStep("success");
        this.submitDisabled = false;
      } catch (e) {
        this.submitDisabled = false;
      }
    },
  },
};
</script>

<style lang="scss">
.text-btn {
  font-weight: 700;
  width: max-content;
  padding: 0;
  color: var(--color-menu-inactive);
  font-size: 14px;
  transition: 0.3s ease color;
  border-radius: 0;
  border: 0;
  border-bottom-width: 1.5px;
  border-bottom-style: solid;
  border-bottom-color: transparent;
}

p,
h2 {
  font-size: 14px;
  font-weight: 500;
  margin: 0px;

  &.title {
    font-weight: 700;
    font-size: 18px;
  }
}

small {
  font-weight: 600;
  font-size: 12px;
  line-height: 19px;
  letter-spacing: 0.02em;
  margin-right: 5px;
  color: var(--color-subheading-text);
}

._balance {
  background: rgba(255, 168, 0, 0.2);
  border: 2px solid rgba(25, 27, 31, 0.1);
  box-sizing: border-box;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;

  h2 {
    color: var(--primary-text);
    font-weight: 600;
  }
}

._input {
  border: 2px solid rgba(25, 27, 31, 0.1);
  box-sizing: border-box;
  border-radius: 12px;

  /* identical to box height, or 119% */
  letter-spacing: 0.02em;
  color: var(--primary-text);
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;

  input {
    padding: 15px 20px;
    box-sizing: border-box;
    border: 0;
    background: transparent;
    border-radius: 12px 0 0 12px;
    outline: none;
    font-weight: 600;
    font-size: 16px;
    width: 100%;
  }
}

.lock-display {
  background: #f4f4f5;
  border-radius: 8px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-tag {
  transition: 0.25s ease all;
  cursor: pointer;
  border: 1px solid #1ec37f;
  box-sizing: border-box;
  border-radius: 12px;
  min-width: 100%;
  margin-bottom: 8px;
  height: 34px;
  font-weight: 800;
  font-size: 12px;
  line-height: 19px;
  text-align: center;
  letter-spacing: 0.02em;
  color: #78dbb2;
  background: transparent;
  &.active {
    background: #1ec37f;
    color: #fff;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.row {
  display: flex;
  align-items: center;
  width: max-content;
}

#crnchy-stake-input {
  margin-top: 16px;
  .el-input__inner {
    background: transparent;
    color: var(--primary-text) !important;
    border-color: var(--border-color);
    padding: 0 !important;

    &::placeholder {
      color: var(--color-subheading-text);
    }
  }
}
</style>
