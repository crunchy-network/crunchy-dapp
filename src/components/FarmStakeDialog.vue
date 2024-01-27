<template>
  <el-dialog
    title="Stake Tokens"
    :visible.sync="form.visible"
    width="380px"
    class="stake-dialog"
  >
    <p v-if="form.farm.poolToken.isQuipuLp" class="stake-infor">
      Stake XTZ/{{ form.farm.poolToken.symbol }} LP tokens to earn
      {{ form.farm.rewardToken.symbol }}.
    </p>
    <p v-else class="stake-infor">
      Stake {{ form.farm.poolToken.symbol }} to earn
      {{ form.farm.rewardToken.symbol }}.
    </p>
    <el-form
      ref="form"
      v-loading.lock="form.loading"
      :model="form"
      label-position="top"
      hide-required-asterisk
    >
      <div
        class="current-balance _info-card"
        style="
          border-radius: 22px;
          background: var(--background-information-card);
          padding: 12px 20px;
          margin-bottom: 18px;
        "
      >
        <el-row type="flex" align="middle" justify="space-between">
          <el-col :span="8" style="font-size: 12px" class="_info-card__title"
            >BALANCE</el-col
          >
          <el-col
            v-if="
              form.farm.poolToken.balance >= 0.0001 ||
              !form.farm.poolToken.balance
            "
            :span="16"
            style="font-weight: bold; text-align: right"
            >{{ vueNumberFormat(form.farm.poolToken.balance) }}</el-col
          >
          <el-col
            v-else-if="form.farm.poolToken.balance >= 0.000001"
            :span="16"
            style="font-weight: bold; text-align: right"
            >{{
              vueNumberFormat(form.farm.poolToken.balance, { precision: 6 })
            }}</el-col
          >
          <el-col
            v-else-if="form.farm.poolToken.balance >= 0.00000001"
            :span="16"
            style="font-weight: bold; text-align: right"
            >{{
              vueNumberFormat(form.farm.poolToken.balance, { precision: 8 })
            }}</el-col
          >
          <el-col
            v-else-if="form.farm.poolToken.balance >= 0.000000000001"
            :span="16"
            style="font-weight: bold; text-align: right"
            >{{
              vueNumberFormat(form.farm.poolToken.balance, { precision: 12 })
            }}</el-col
          >
          <el-col
            v-else
            :span="16"
            style="font-weight: bold; text-align: right"
            >{{
              vueNumberFormat(form.farm.poolToken.balance, { precision: 18 })
            }}</el-col
          >
        </el-row>
      </div>
      <el-form-item
        v-if="form.farm.poolToken.isPlentyLp"
        label="Stake Tokens"
        prop="input"
        :rules="[
          {
            type: 'number',
            required: true,
            message: 'Enter an amount',
            transform: (v) => Number(v),
          },
          {
            type: 'number',
            min: 0.000000000001,
            message: 'Enter a valid amount (at least 0.000000000001)',
            transform: (v) => Number(v),
          },
        ]"
        style="margin-bottom: 14px"
      >
        <el-input v-model="form.input" label="Stake Tokens">
          <span slot="suffix">{{ form.farm.poolToken.symbol }}</span>
        </el-input>
      </el-form-item>
      <el-form-item
        v-else-if="form.farm.poolToken.isSpicyLp"
        label="Stake Tokens"
        prop="input"
        :rules="[
          {
            type: 'number',
            required: true,
            message: 'Enter an amount',
            transform: (v) => Number(v),
          },
          {
            type: 'number',
            min: 0.000000000000000001,
            message: 'Enter a valid amount (at least 0.000000000000000001)',
            transform: (v) => Number(v),
          },
        ]"
        style="margin-bottom: 14px"
      >
        <el-input v-model="form.input" label="Stake Tokens">
          <span slot="suffix">{{ form.farm.poolToken.symbol }}</span>
        </el-input>
      </el-form-item>
      <el-form-item
        v-else
        label="Stake Tokens"
        prop="input"
        :rules="[
          {
            type: 'number',
            required: true,
            message: 'Enter an amount',
            transform: (v) => Number(v),
          },
          {
            type: 'number',
            min: 0.000001,
            message: 'Enter a valid amount (at least 0.000001)',
            transform: (v) => Number(v),
          },
        ]"
        style="margin-bottom: 14px"
      >
        <el-input v-model="form.input" label="Stake Tokens">
          <span v-if="form.farm.poolToken.isQuipuLp" slot="suffix"
            >XTZ/{{ form.farm.poolToken.symbol }} LP</span
          >
          <span v-else slot="suffix">{{ form.farm.poolToken.symbol }}</span>
        </el-input>
      </el-form-item>
      <el-button
        type="success"
        size="small"
        round
        style="margin-bottom: 20px"
        @click="form.input = form.farm.poolToken.balance"
        >USE MAX</el-button
      >
      <div class="stake-warning" style="word-break: auto-phrase">
        <span class="stake-warning__notice">NOTICE:</span>
        <br />
        <span class="stake-warning__content"
          >Unclaimed deposits and rewards are subject to a 0.55% fee per day,
          beginning 6 months after a farm completes.</span
        >
      </div>
      <el-button
        type="primary"
        style="
          border-radius: 12px;
          font-weight: bold;
          width: 100%;
          padding: 20px;
          margin-left: 0;
        "
        @click="stakeFarm(form.farm.id)"
        >STAKE</el-button
      >
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "FarmStakeDialog",
  data() {
    return {
      form: {
        input: "",
        loading: false,
        visible: false,
        farm: {
          poolToken: { balance: 0, isSpicyLp: false, isPlentyLp: false },
          rewardToken: {},
        },
      },
    };
  },
  computed: {
    ...mapState(["farms"]),
  },
  methods: {
    ...mapActions(["stakeInFarm", "initFarm", "getPoolTokenBalance"]),

    async showDialog(farmId) {
      this.form.input = "";
      this.form.farm = this.farms.data[farmId];
      if (Object.prototype.hasOwnProperty.call(this.$refs, "form")) {
        this.$refs.form.resetFields();
      }
      this.form.loading = true;
      this.form.visible = true;
      await this.initFarm({ farmId });
      const bal = await this.getPoolTokenBalance(farmId);
      this.form.farm = this.farms.data[farmId];
      this.form.farm.poolToken.balance = bal;
      this.form.loading = false;
    },

    async stakeFarm(farmId) {
      const vm = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.stakeInFarm({ farmId: farmId, amount: vm.form.input });
          vm.form.visible = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";
</style>
