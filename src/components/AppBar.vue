<template>
  <div>
    <el-header
      style="
        position: fixed;
        height: 90px;
        top: 0;
        left: 230px;
        right: 0;
        background: #fff;
        z-index: 999;
      "
    >
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right">
            <NavWallet />
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </el-header>
    <div class="spacing"></div>
  </div>
</template>

<script>
import NavWallet from "./NavWallet.vue";
export default {
  components: { NavWallet },
  name: "AppBar",
};
</script>

<style lang="scss" scoped>
.spacing {
  margin-bottom: 90px;
}
</style>