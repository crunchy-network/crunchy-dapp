<template>
  <el-dialog
    v-loading="submitDisabled"
    width="500px"
    :modal="true"
    :visible.sync="visible"
  >
    <div>
      <template v-if="confirm">
        <h2 v-if="unstakeEarly" style="margin: 0">
          Confirm Early CRNCHY Unstake
        </h2>
        <h2 v-else style="margin: 0">Confirm CRNCHY Unstake</h2>

        <p v-if="unstakeEarly" class="color__subheading fs__14">
          Please confirm your early unstake details below.
        </p>
        <p v-else class="color__subheading fs__14">
          Please confirm your unstaking details below.
        </p>

        <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
          <div class="row">
            <small>CRNCHY to Unlock:</small>
          </div>
          <div class="row text__right">
            <h2 :class="['fs__18', unstakeEarly ? '' : 'color__success']">
              {{
                vueNumberFormat(finalInputAmount, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
            </h2>
          </div>
        </el-row>

        <el-row
          v-if="unstakeEarly"
          :gutter="5"
          type="flex"
          justify="space-between"
          class="mt__8"
        >
          <div class="row">
            <small>CRNCHY you will receive:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__16 color__success">
              {{
                vueNumberFormat(estimatedCrnchyAfterBurn, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
            </h2>
          </div>
        </el-row>
        <el-row
          v-if="unstakeEarly"
          :gutter="5"
          type="flex"
          justify="space-between"
          class="mt__8"
        >
          <div class="row">
            <small>CRNCHY Unlock Fee to Burn:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__16 color__danger">
              {{
                vueNumberFormat(estimatedCrnchyBurn, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
            </h2>
          </div>
        </el-row>

        <el-row :gutter="5" type="flex" justify="space-between" class="mt__8">
          <div class="row">
            <small>crVOTE to Burn:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__18 color__danger">
              {{
                vueNumberFormat(estimatedCrVoteBurn, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
            </h2>
          </div>
        </el-row>

        <el-row :gutter="5" type="flex" justify="space-between" class="mt__8">
          <div class="row">
            <small>New Pool Ownership:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__16">
              {{
                vueNumberFormat(estimatedPoolSharePct, {
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

        <div class="my__24">
          <el-divider></el-divider>
        </div>

        <el-row :gutter="5" type="flex" justify="space-between">
          <div class="row">
            <small>CRNCHY Still Staked:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__18">
              {{
                vueNumberFormat(finalOutputAmount, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
            </h2>
          </div>
        </el-row>
        <el-row :gutter="5" type="flex" justify="space-between" class="mt__8">
          <div class="row">
            <small>crVOTE Still Owned:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__18">
              {{
                vueNumberFormat(estimatedCrVoteRemain, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
            </h2>
          </div>
        </el-row>
      </template>
      <template v-else>
        <h2 v-if="unstakeEarly" style="margin: 0">Unstake CRNCHY Early</h2>
        <h2 v-else style="margin: 0">Unstake CRNCHY</h2>

        <p v-if="unstakeEarly" class="color__subheading fs__14">
          If you wish to unstake your CRNCHY earlier than your previously agreed
          upon locked time, you can pay an early unlock fee. The fee is
          calculated based on how much time is remaining on your current lock
          and is deducted from your staked amount.
        </p>
        <p v-else class="color__subheading fs__14">
          Select an amount of CRNCHY to unlock.
        </p>

        <div v-if="unstakeEarly">
          <el-row
            :gutter="5"
            type="flex"
            justify="space-between"
            class="mt__24"
          >
            <div
              class="row"
              style="flex-direction: column; align-items: inherit"
            >
              <small>Original Lock Date</small>
              <h2 class="fs__16">
                {{
                  crnchyStaking.myStaking.lockEndTime
                    | moment("MMM DD YYYY HH:mm Z")
                }}
              </h2>
            </div>
            <div
              class="row text__right"
              style="flex-direction: column; align-items: inherit"
            >
              <small>Current Unlock Date</small>
              <h2 class="fs__16">
                {{ new Date() | moment("MMM DD YYYY HH:mm Z") }}
              </h2>
            </div>
          </el-row>
          <el-row
            :gutter="5"
            type="flex"
            justify="space-between"
            class="mt__24"
          >
            <div
              class="row"
              style="flex-direction: column; align-items: inherit"
            >
              <small>Amount Locked</small>
              <h2 class="fs__16">
                {{
                  vueNumberFormat(crnchyStaking.myStaking.nextCycle.deposit, {
                    prefix: "",
                    decimal: ".",
                    thousand: ",",
                    precision: 4,
                  })
                }}
                CRNCHY
              </h2>
            </div>
            <div
              class="row text__right"
              style="flex-direction: column; align-items: inherit"
            >
              <small>% of Time Remaining</small>
              <h2 class="fs__16">
                {{
                  vueNumberFormat(lockTimeRemainingPct, {
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
        </div>
        <div v-else class="mt__24">
          <p class="color__subheading fs__14 fw__7">Date Unlocked</p>
          <p class="fs__16 fw__7">
            {{
              crnchyStaking.myStaking.lockEndTime
                | moment("MMM DD YYYY HH:mm Z")
            }}
          </p>
        </div>

        <div class="mt__24">
          <crnchy-stake-input
            mode="unstake"
            :set-input-amount="setInputAmount"
            :initial-amount="inputAmount"
          >
            <p class="color__subheading fs__14 fw__7">CRNCHY to Unlock</p>
          </crnchy-stake-input>
        </div>

        <el-row
          v-if="unstakeEarly"
          :gutter="5"
          type="flex"
          justify="space-between"
          class="mt__24"
        >
          <div class="row">
            <small>Unlock Fee to Burn:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__16 color__danger">
              {{
                vueNumberFormat(estimatedCrnchyBurn, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
              CRNCHY
            </h2>
          </div>
        </el-row>
        <el-row
          v-if="unstakeEarly"
          :gutter="5"
          type="flex"
          justify="space-between"
          class="mt__8"
        >
          <div class="row">
            <small>Amount that Will Unlock:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__16 color__success">
              {{
                vueNumberFormat(estimatedCrnchyAfterBurn, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
              CRNCHY
            </h2>
          </div>
        </el-row>

        <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
          <div class="row">
            <small>crVOTE Needed to Unlock:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__16">
              {{
                vueNumberFormat(estimatedCrVoteBurn, {
                  prefix: "",
                  decimal: ".",
                  thousand: ",",
                  precision: 4,
                })
              }}
            </h2>
          </div>
        </el-row>
        <el-row :gutter="5" type="flex" justify="space-between" class="mt__8">
          <div class="row">
            <small>New Pool Share:</small>
          </div>
          <div class="row text__right">
            <h2 class="fs__16">
              {{
                vueNumberFormat(estimatedPoolSharePct, {
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
      </template>
      <div class="my__24 lock-display _info-card">
        <p v-if="unstakeEarly" class="color__subheading fs__12 text__center">
          You are unstaking your tokens early. YOU WILL BE CHARGED AN EARLY
          UNLOCK FEE THAT IS DEDUCTED FROM THE TOKENS YOU HAVE STAKED. Please
          make sure you pay close attention to the breakdown above before you
          unstake early.
        </p>
        <p v-else class="color__subheading fs__12 text__center">
          Once you unstake your tokens, you will need to stake and lock your
          tokens again to earn rewards and voting power.
        </p>
      </div>
      <template v-if="confirm">
        <el-row type="flex" justify="center" style="gap: 40px">
          <el-button
            round
            type="primary"
            class="btn-alt__3"
            @click="confirm = false"
          >
            Back
          </el-button>
          <el-button
            v-if="unstakeEarly"
            round
            type="primary"
            @click="submitUnstake"
            >Unstake Early</el-button
          >
          <el-button v-else round type="primary" @click="submitUnstake"
            >Unstake CRNCHY</el-button
          >
        </el-row>
      </template>
      <div v-else class="row__center">
        <el-button
          v-if="unstakeEarly"
          type="primary"
          round
          @click="() => (confirm = true)"
        >
          Unstake Early
        </el-button>
        <el-button v-else type="primary" round @click="() => (confirm = true)">
          Unstake CRNCHY
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CrnchyStakeInput from "./CrnchyStakeInput.vue";

export default {
  name: "CrnchyUnstakeDialogue",
  components: { CrnchyStakeInput },
  data() {
    return {
      visible: false,
      confirm: false,
      unstakeEarly: false,
      inputAmount: 0,
      submitDisabled: false,
    };
  },
  computed: {
    ...mapState(["crnchyStaking"]),

    estimatedCrVoteBurn: function () {
      return (this.finalInputAmount * this.myStakingPowerPct) / 100;
    },
    estimatedCrVoteRemain: function () {
      return (
        this.crnchyStaking.myStaking.nextCycle.issued - this.estimatedCrVoteBurn
      );
    },
    estimatedPoolSharePct: function () {
      return (
        ((this.crnchyStaking.myStaking.nextCycle.deposit -
          this.finalInputAmount) /
          (this.crnchyStaking.nextCycle.totalDeposit - this.finalInputAmount)) *
        100
      );
    },
    finalOutputAmount: function () {
      return (
        this.crnchyStaking.myStaking.nextCycle.deposit - this.finalInputAmount
      );
    },
    finalInputAmount: function () {
      return Number(this.inputAmount);
    },
    myStakingPowerPct: function () {
      return (
        this.crnchyStaking.settings.stakingPowerMap[
          this.crnchyStaking.myStaking.nextCycle.stakingPower
        ] || 0
      );
    },
    lockTimeRemainingPct: function () {
      return (
        ((this.crnchyStaking.myStaking.lockEndTime.getTime() -
          new Date().getTime()) /
          1000 /
          this.crnchyStaking.myStaking.nextCycle.stakingPower) *
        100
      );
    },
    estimatedCrnchyBurn: function () {
      return (this.finalInputAmount * this.lockTimeRemainingPct) / 100;
    },
    estimatedCrnchyAfterBurn: function () {
      return (
        this.finalInputAmount -
        (this.finalInputAmount * this.lockTimeRemainingPct) / 100
      );
    },
  },
  methods: {
    ...mapActions(["unstakeCrnchyStaking"]),

    showDialog(unstakeEarly = false) {
      this.unstakeEarly = unstakeEarly;
      this.visible = true;
    },
    setInputAmount(amount) {
      this.inputAmount = amount;
    },
    async submitUnstake() {
      try {
        this.submitDisabled = true;
        await this.unstakeCrnchyStaking({
          amount: this.finalInputAmount,
        });
        this.visible = false;
      } catch (e) {
        this.submitDisabled = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
}
small {
  color: var(--color-subheading-text);
  font-weight: 700;
  font-size: 14px;
}
</style>
