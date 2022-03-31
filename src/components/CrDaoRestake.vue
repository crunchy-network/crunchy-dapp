<template>
  <div>
    <div class="_balance">
      <p>Staked Balance:</p>

      <h2>5.2</h2>
    </div>

    <div style="margin-top: 16px">
      <h2 style="color: rgba(25, 27, 31, 0.6)">Extend Lock Time</h2>
    </div>

    <el-row style="margin-top: 32px" :gutter="8">
      <el-col :span="8">
        <button
          disabled
          :class="['time-tag', time === '1 Week' && 'active']"
          @click="setTime('1 Week')"
        >
          1 Week
        </button>
      </el-col>
      <el-col :span="8">
        <button
          disabled
          :class="['time-tag', time === '1 Month' && 'active']"
          @click="setTime('1 Month')"
        >
          1 Month
        </button>
      </el-col>
      <el-col :span="8">
        <button
          disabled
          :class="['time-tag', time === '5 Months' && 'active']"
          @click="setTime('5 Months')"
        >
          5 Months
        </button>
      </el-col>
      <el-col :span="8">
        <button
          :class="['time-tag', time === '1 Year' && 'active']"
          @click="setTime('1 Year')"
        >
          1 Year
        </button>
      </el-col>
      <el-col :span="8">
        <button
          :class="['time-tag', time === '2 Years' && 'active']"
          @click="setTime('2 Years')"
        >
          2 Years
        </button>
      </el-col>
      <el-col :span="8">
        <button
          :class="['time-tag', time === '4 years' && 'active']"
          @click="setTime('4 years')"
        >
          4 years
        </button>
      </el-col>
    </el-row>

    <div class="lock-display">
      <small> Unlocks: 12 June 2026 14:23 UTC </small>
    </div>

    <div style="margin-top: 40px">
      <h2 style="color: rgba(25, 27, 31, 0.6)">You Will Have</h2>
    </div>

    <el-row
      :gutter="5"
      type="flex"
      justify="space-between"
      style="margin-top: 10px"
    >
      <div class="row">
        <small> crVOTE: </small>
        <h2 style="color: #191b1f">123.1234</h2>
      </div>
      <div class="row">
        <small>Staking Power:</small>
        <h2 style="color: #191b1f">12.2%</h2>
      </div>
    </el-row>

    <el-row style="margin-top: 50px" type="flex" justify="center">
      <el-button round type="primary" style="min-width: 50%"> Re-Stake </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "CrDaoRestake",
  data() {
    return {
      time: "",
    };
  },
  methods: {
    setTime(param = "") {
      this.time = param;
    },
  },
};
</script>

<style lang="scss" scoped>
p,
h2 {
  color: rgba(25, 27, 31, 0.4);
  font-size: 14px;
  font-weight: 500;
  margin: 0px;
}

small {
  font-weight: 600;
  font-size: 12px;
  line-height: 19px;
  letter-spacing: 0.02em;
  color: #606266;
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
    color: #191b1f;
    font-weight: 600;
  }
}

._input {
  border: 2px solid rgba(25, 27, 31, 0.1);
  box-sizing: border-box;
  border-radius: 12px;

  /* identical to box height, or 119% */
  letter-spacing: 0.02em;
  color: #191b1f;
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
  background: #f4f4f5;
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