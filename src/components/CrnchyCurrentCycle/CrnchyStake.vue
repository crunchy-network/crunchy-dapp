<template>
  <div style="transition: 0.45s ease all">
    <template v-if="tab === 'stake'">
      <div style="margin-bottom: 16px">
        <h2
          style="
            font-weight: 600;
            font-size: 16px;
            margin: 0;
            color: var(--primary-text);
          "
        >
          Stake CRNCHY
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
          Stake CRNCHY to earn farm rewards and crVOTE to participate in DAO
          votes. If you already have staked CRNCHY, you must stake past your
          original stake date.
        </h2>
      </div>

      <crnchy-stake-dropdown
        :set-input-amount="setInputAmount"
        :input-amount="inputAmount"
      />

      <div style="margin-top: 16px">
        <h2 style="color: var(--color-subheading-text); font-size: 14px">
          Select a Lock Time
        </h2>
      </div>

      <el-row style="margin-top: 10px" :gutter="8">
        <el-col :span="8">
          <button
            disabled
            :class="['time-tag', time === '1 Week' && 'active']"
            type="button"
            @click="setTime('1 Week')"
          >
            1 Week
          </button>
        </el-col>
        <el-col :span="8">
          <button
            disabled
            :class="['time-tag', time === '1 Month' && 'active']"
            type="button"
            @click="setTime('1 Month')"
          >
            1 Month
          </button>
        </el-col>
        <el-col :span="8">
          <button
            disabled
            :class="['time-tag', time === '5 Months' && 'active']"
            type="button"
            @click="setTime('5 Months')"
          >
            5 Months
          </button>
        </el-col>
        <el-col :span="8">
          <button
            :class="['time-tag', time === '1 Year' && 'active']"
            type="button"
            @click="setTime('1 Year')"
          >
            1 Year
          </button>
        </el-col>
        <el-col :span="8">
          <button
            :class="['time-tag', time === '2 Years' && 'active']"
            type="button"
            @click="setTime('2 Years')"
          >
            2 Years
          </button>
        </el-col>
        <el-col :span="8">
          <button
            :class="['time-tag', time === '4 years' && 'active']"
            type="button"
            @click="setTime('4 years')"
          >
            4 years
          </button>
        </el-col>
      </el-row>
    </template>

    <template v-if="tab === 'confirm'">
      <h2 class="title">Confirm CRNCHY Stake</h2>
      <p style="color: var(--color-subheading-text)">
        Please confirm your staking details below.
      </p>

      <el-row style="margin-top: 24px; margin-bottom: 8px">
        <el-col :span="12">
          <p style="color: var(--color-subheading-text)" class="fw__7">
            CRNCHY Staked
          </p>

          <number-format
            class-name="fs__18 fw__7"
            :value="inputAmount"
            :precision="2"
            :font-size="18"
            :short-hand="false"
          />
        </el-col>
        <el-col :span="12" style="text-align: right">
          <p style="color: var(--color-subheading-text)" class="fw__7">
            Lock Time
          </p>
          <p class="fs__18 fw__7">{{ time }}</p></el-col
        >
      </el-row>
    </template>

    <div class="lock-display _info-card" style="margin-top: 16px">
      <p style="color: var(--primary-text); font-size: 12px">
        Unlocks: 12 June 2026 14:23 UTC
      </p>
    </div>

    <div style="margin-top: 24px; margin-bottom: 10px">
      <h2 class="fw__7">You Will Receive</h2>
    </div>

    <el-row
      :gutter="5"
      type="flex"
      justify="space-between"
      style="margin-top: 10px"
    >
      <div class="row">
        <small> crVOTE: </small>
        <h2 style="color: var(--primary-text)">123.1234</h2>
      </div>
      <div class="row">
        <small>Staking Power:</small>
        <h2 style="color: var(--primary-text)">12.2%</h2>
      </div>
    </el-row>

    <el-row style="margin-top: 32px" type="flex" justify="center">
      <template v-if="tab === 'stake'">
        <el-button
          round
          type="primary"
          style="min-width: 50%"
          @click="setTab('confirm')"
        >
          Stake
        </el-button>
      </template>
      <template v-if="tab === 'confirm'">
        <el-row type="flex" justify="center" style="gap: 40px">
          <el-button
            round
            type="primary"
            class="btn-alt__3"
            @click="setTab('stake')"
          >
            Back
          </el-button>

          <el-button round type="primary"> Stake CRNCHYY </el-button>
        </el-row>
      </template>
    </el-row>
  </div>
</template>

<script>
import CrnchyStakeDropdown from "./CrnchyStakeInput.vue";
import NumberFormat from "../NumberFormat.vue";
export default {
  name: "CrDaoStake",
  components: { CrnchyStakeDropdown, NumberFormat },
  data() {
    return {
      time: "",
      tab: "stake",
      inputAmount: 1,
    };
  },

  methods: {
    setTime(param = "") {
      this.time = param;
    },

    setTab(param = "") {
      if (["stake", "confirm"].includes(param)) this.tab = param;
    },

    setInputAmount(param = 1) {
      this.inputAmount = param;
    },
  },
};
</script>

<style lang="scss" scoped>
p,
h2 {
  font-size: 14px;
  font-weight: 500;
  margin: 0px;

  &.title {
    font-weight: 700;
    font-size: 20px;
  }
}

small {
  font-weight: 600;
  font-size: 12px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: var(--color-subheading-text);
  margin-right: 5px;
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

.lock-display {
  border-radius: 8px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row {
  display: flex;
  align-items: center;
  width: max-content;
}
</style>
