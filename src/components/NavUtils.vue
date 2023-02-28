<template>
  <el-row type="flex" align="middle" style="padding: 0 10px" :gutter="10">
    <el-col style="padding: 0 10px">
      <crnchy-price />
    </el-col>
    <el-col style="padding: 0 10px">
      <usd-xtz-switch />
    </el-col>
  </el-row>
</template>

<script>
import CrnchyPrice from "./CrnchyPrice.vue";
import UsdXtzSwitch from "./UsdXtzSwitch.vue";
export default {
  name: "NavUtils",
  components: { UsdXtzSwitch, CrnchyPrice },
};
</script>

<style></style>
