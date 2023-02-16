<template>
  <el-dropdown
    style="cursor: pointer"
    trigger="hover"
    @command="toggleUsdXtzSwitch"
  >
    <span
      style="color: #555CFF; font-size: 16px; font-weight: 600"
      class="el-dropdown-link"
    >
      {{ getShowUsd ? "USD" : "XTZ" }}
      <i style="color: #191b1f" class="el-icon-arrow-down el-icon--right"></i>
    </span>

    <el-dropdown-menu slot="dropdown" style="border-radius: 12px">
      <el-dropdown-item class="xtz-usd-switch" command="xtz"
        >XTZ</el-dropdown-item
      >
      <el-dropdown-item class="xtz-usd-switch" command="usd">
        USD
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UsdXtzSwitch",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["getShowUsd"]),
  },

  mounted() {
    this.lsUsdState();
  },

  methods: {
    ...mapActions(["lsUsdState", "toggleUsdXtzSwitch"]),
  },
};
</script>

<style lang="scss">
.el-dropdown-menu__item.xtz-usd-switch {
  border-left: 4px solid transparent;
  transition: 0.25s ease border-color;
  color: #191b1f;
  font-size: 16px;
  font-weight: 600;
}
.el-dropdown-menu__item.xtz-usd-switch:hover {
  border-left: 4px solid #555cff;
}
</style>
