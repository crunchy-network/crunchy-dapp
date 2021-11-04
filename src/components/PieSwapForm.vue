<template>
  <el-form :model="form" ref="form" label-position="top" hide-required-asterisk>
    <h2 style="margin-bottom: 0; font-size: 18px;">You Pay</h2>

    <div class="row-between" style="margin-bottom: 16px;">
      <h2
        style="
          color: #191b1f;
          opacity: 0.4;
          font-size: 14px;
          margin-bottom: 0px;
        "
      >
        1 XTZ = 1 GHOST
      </h2>

      <h2 style="color: #191b1f; font-size: 14px; margin-bottom: 0px;">
        <span style="opacity: 0.4;">Current Balance :</span>
        {{ wallet.balance.toNumber() / 1000000 }} XTZ
      </h2>
    </div>
    <el-row :gutter="20" type="flex">
      <el-col :span="17" style="position: relative;">
        <el-form-item
          prop="inputXtz"
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
          key="input-xtz"
        >
          <el-input round v-model="form.inputXtz" label="XTZ Input">
            <span slot="suffix">
              <el-button type="success" size="small" round style="font-weight: bold;" @click="form.inputXtz = wallet.balance.toNumber() / 1000000">
                USE MAX
              </el-button>
            </span>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col style="position: relative;" :span="7">
        <el-button style="display: flex; width: 100%; height: 40px;" plain>
          <el-row type="flex" align="middle">
            <el-avatar shape="circle" :size="18" src="data:image/png;base64,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"></el-avatar>
            <h2
              style="
                color: #191b1f;
                font-size: 14px;
                margin: 0px;
                margin-left: 5px;
              "
            >
              XTZ
            </h2>
          </el-row>
        </el-button>
      </el-col>
    </el-row>

    <h2 style="font-size: 18px;">You Get</h2>

    <el-row :gutter="20" type="flex">
      <el-col :span="17" style="position: relative;">
        <el-form-item
          prop="inputXtz"
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
          key="input-xtz"
        >
          <el-input disabled round v-model="getEquivalent" label="XTZ Input">
            <span slot="suffix">
              <el-button type="text" style="color: #191b1f; font-size: 16px;" circle icon="el-icon-warning-outline" />
            </span>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col style="position: relative;" :span="7">
        <el-button disabled type="info" style="display: flex; width: 100%; height: 40px;" plain>
          <el-row type="flex" align="middle">
            <el-avatar shape="circle" :size="18" src="./../assets/zdj7Wj2XeX8BtcAvo58rEXWdcyumxWviXELYC8Jd3SjiP5xuo 2 (1).svg" />
            <h2 style="color: #191b1f;font-size: 14px; margin: 0px; margin-left: 5px;">
              GHOST
            </h2>
          </el-row>
        </el-button>
      </el-col>
    </el-row>

    <el-button type="primary" style="border-radius: 12px; font-weight: bold; width: 100%; padding: 12px 20px; margin-left: 0; 100%; margin-top: 22px">Swap</el-button>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PieSwapForm",

  data: () => ({
    form: {
      inputXtz: "",
    },
    getEquivalent: "",
  }),

  computed: {
    ...mapState(["wallet"]),
  },

  created() {
    this.refresh();
  },
};
</script>

<style lang="scss" scoped>
.row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-form-item__label {
  color: #a3a4a5;
}
.el-input .el-input__inner {
  border-radius: 12px;
}

.el-input.is-disabled .el-input__inner {
  color: #191b1f;
  border-color: #f6f6f6;
}
.el-input.is-disabled .el-input__suffix {
  color: #191b1f;
  font-weight: bold;
}
</style>
