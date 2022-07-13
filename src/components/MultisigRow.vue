<template>
  <el-row
    style="padding-bottom: 14px; font-size: 14px; font-weight: 600"
    type="flex"
    align="top"
  >
    <el-col :span="24">
      <div class="item-row">
        <el-row
          :gutter="20"
          class="farm-row lg"
          style="margin-left: 0; margin-right: 0"
          type="flex"
          align="middle"
        >
          <el-col :span="7">{{ multisig.alias }}</el-col>
          <el-col class="text-right" :span="5">{{
            multisig.adminsCount
          }}</el-col>
          <el-col class="text-right" :span="5">{{
            multisig.txCompleted
          }}</el-col>
          <el-col class="text-right" :span="4">{{ multisig.created }}</el-col>
          <el-col class="text-right" :span="3">
            <router-link
              tag="a"
              class="link-text"
              :to="`/multisig/${multisig.address}`"
              type="text"
              style="
                font-weight: 600;
                font-size: 16px;
                line-height: 18px;
                color: #555cff;
                text-decoration: none;
              "
            >
              Manage
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "MultisigRow",
  props: {
    multisig: { type: Object, required: true },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.item-row {
  /* border: 1px solid #ebeef5; */
  border-radius: 14px;
}

.n-change {
  color: $--color-danger;
}

.p-change {
  color: $--color-success;
}
</style>
