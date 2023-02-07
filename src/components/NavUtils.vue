<template>
  <el-row type="flex" align="middle" style="padding: 0 10px 0 10px; gap: 10px">
    <div>
      <crnchy-price />
    </div>
    <div>
      <usd-xtz-switch />
    </div>
    <slot></slot>
    <div>
      <nav-wallet />
    </div>
    <div>
      <ToggleTheme />
    </div>
  </el-row>
</template>

<script>
import CrnchyPrice from "./CrnchyPrice.vue";
import NavWallet from "./NavWallet.vue";
import ToggleTheme from "./ToggleTheme.vue";
import UsdXtzSwitch from "./UsdXtzSwitch.vue";
export default {
  name: "NavUtils",
  components: { UsdXtzSwitch, CrnchyPrice, NavWallet, ToggleTheme },
};
</script>

<style></style>
