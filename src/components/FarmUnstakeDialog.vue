<template>
  <el-dialog
    title="Unstake Tokens"
    :visible.sync="form.visible"
    width="380px"
    class="stake-dialog"
  >
    <p v-if="form.farm.poolToken.isQuipuLp" style="word-break: normal">
      Withdrawing XTZ/{{ form.farm.poolToken.symbol }} LP tokens will reduce
      your ability to earn {{ form.farm.rewardToken.symbol }}.
    </p>
    <p v-else style="word-break: normal">
      Withdrawing {{ form.farm.poolToken.symbol }} will reduce your ability to
      earn {{ form.farm.rewardToken.symbol }}.
    </p>
    <el-form
      ref="form"
      v-loading.lock="form.loading"
      :model="form"
      label-position="top"
      hide-required-asterisk
    >
      <div
        class="current-balance"
        style="
          border-radius: 22px;
          background: #ffeecc;
          padding: 12px 20px;
          margin-bottom: 18px;
        "
      >
        <el-row type="flex" align="middle" justify="space-between">
          <el-col :span="11" style="font-size: 12px">STAKED BALANCE</el-col>
          <el-col
            :span="13"
            style="color: #303133; font-weight: bold; text-align: right"
            >{{ vueNumberFormat(form.farm.depositAmount) }}</el-col
          >
        </el-row>
      </div>
      <el-form-item
        label="Unstake Tokens"
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
        <el-input v-model="form.input" label="Unstake Tokens">
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
        style="margin-bottom: 22px"
        @click="form.input = form.farm.depositAmount"
        >USE MAX</el-button
      >
      <el-button
        type="primary"
        style="
          border-radius: 12px;
          font-weight: bold;
          width: 100%;
          padding: 20px;
          margin-left: 0;
        "
        @click="unstakeFarm(form.farm.id)"
        >UNSTAKE</el-button
      >
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "FarmUnstakeDialog",
  data() {
    return {
      form: {
        input: "",
        loading: false,
        visible: false,
        farm: { poolToken: {}, rewardToken: {}, depositAmount: 0 },
      },
    };
  },
  computed: {
    ...mapState(["farms"]),
  },
  methods: {
    ...mapActions(["unstakeFromFarm", "softUpdateFarm"]),

    async showDialog(farmId) {
      this.form.input = "";
      this.form.farm = this.farms.data[farmId];
      if (Object.prototype.hasOwnProperty.call(this.$refs, "form")) {
        this.$refs.form.resetFields();
      }
      this.form.loading = true;
      this.form.visible = true;
      await this.softUpdateFarm(farmId);
      this.form.farm = this.farms.data[farmId];
      this.form.loading = false;
    },

    async unstakeFarm(farmId) {
      const vm = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.unstakeFromFarm({ farmId: farmId, amount: vm.form.input });
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
