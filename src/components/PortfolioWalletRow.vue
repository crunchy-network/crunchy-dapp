<template>
  <el-row style="padding-bottom: 14px; font-size: 14px; font-weight: 600;" type="flex" align="top">
    <el-col :span="24">
      <div class="item-row">
        <el-row :gutter="20" class="farm-row" style="margin-left: 0; margin-right: 0;" type="flex" align="middle">
          <el-col style="text-align: left;" :span="6">
            <el-row type="flex" style="align-items: center;">
              <el-avatar
                :src="asset.icon"
                fit="cover"
                shape="circle"
                :size="40"
                style="position: relative; border: 4px solid #fff; vertical-align: middle; margin-right: 10px"
              ></el-avatar>
              {{ asset.asset }}
            </el-row>
          </el-col>

          <el-col style="text-align: right;" :span="6">
            {{ vueNumberFormat(asset.balance, { prefix: "", decimal: ".", thousand: ",", precision: 4 }) }}
          </el-col>
          <el-col style="text-align: right;" :span="6">
            {{
              !showUsd
                ? vueNumberFormat(asset.price, { prefix: "ꜩ", decimal: ".", thousand: ",", precision: 4 })
                : vueNumberFormat(asset.priceUsd, { prefix: "$", decimal: ".", thousand: ",", precision: 2 })
            }}
          </el-col>
          <el-col style="text-align: right;" :span="6">
            {{
              !showUsd
                ? vueNumberFormat(asset.value, { prefix: "ꜩ", decimal: ".", thousand: ",", precision: 4 })
                : vueNumberFormat(asset.valueUsd, { prefix: "$", decimal: ".", thousand: ",", precision: 2 })
            }}
          </el-col>
          <!-- <el-col style="text-align: right;" :span="3">
            <el-button style="color: #555CFF; font-weight: 600" type="text"> TRADE </el-button>
          </el-col> -->
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "PortfolioWalletRow",
  props: ["asset", "showUsd"],
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.item-row {
  /* border: 1px solid #ebeef5; */
  border-radius: 14px;
}
</style>
