<template>
  <el-switch
    v-model="usdXtzSwitch.showUsd"
    :disabled="disabled"
    style="margin-right: 24px"
    active-color="#1EC37F"
    inactive-color="#555CFF"
    active-text="USD"
    inactive-text="XTZ"
    @change="toggleUsdXtzSwitch"
  >
  </el-switch>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

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
    ...mapState(["usdXtzSwitch"]),
  },

  mounted() {
    this.lsUsdState();
  },

  methods: {
    ...mapActions(["lsUsdState", "toggleUsdXtzSwitch"]),
  },
};
</script>

<style scoped></style>
