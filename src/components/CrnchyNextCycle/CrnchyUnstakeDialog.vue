<template>
  <el-dialog width="500px" :modal="true" :visible.sync="visible">
    <div>
      <unstake-early v-if="unstakeEarly"></unstake-early>
      <unstake v-else></unstake>
    </div>
  </el-dialog>
</template>

<script>
import Unstake from "./Unstake.vue";
import UnstakeEarly from "./UnstakeEarly.vue";

export default {
  name: "CrnchyUnstakeDialogue",
  components: { Unstake, UnstakeEarly },

  data() {
    return {
      visible: false,
      unstakeEarly: true,
    };
  },

  methods: {
    async showDialog() {
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
