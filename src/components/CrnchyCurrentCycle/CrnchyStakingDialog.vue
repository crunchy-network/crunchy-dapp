<template>
  <el-dialog
    width="400px"
    :modal="true"
    :visible.sync="visible"
    @closed="() => setDialogTab('stake')"
  >
    <div
      class="box-card"
      style="flex: 1; display: flex; flex-direction: column"
    >
      <div style="margin-bottom: 24px; display: flex; align-items: end">
        <el-button
          class="text-btn"
          type="text"
          :style="
            dialogTab === 'stake' &&
            'border-bottom-color: var(--color-menu-active); color: var(--color-menu-active);'
          "
          @click="switchDialogTab('stake')"
        >
          Stake
        </el-button>
        <el-button
          class="text-btn"
          type="text"
          :style="
            dialogTab === 'restake' &&
            'border-bottom-color: var(--color-menu-active); color: var(--color-menu-active);'
          "
          @click="switchDialogTab('restake')"
        >
          Re-Stake
        </el-button>
      </div>

      <div>
        <crnchy-stake v-if="dialogTab === 'stake'"></crnchy-stake>
        <crnchy-restake v-if="dialogTab === 'restake'"></crnchy-restake>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import CrnchyRestake from "./CrnchyRestake.vue";
import CrnchyStake from "./CrnchyStake.vue";

export default {
  name: "CrnchyStakingDialogue",
  components: {
    CrnchyStake,
    CrnchyRestake,
  },

  props: {
    setDialogTab: {
      type: Function,
      default: () => {},
    },
    dialogTab: {
      type: String,
      default: "stake",
    },
  },

  data() {
    return {
      visible: false,
    };
  },

  methods: {
    switchDialogTab(tab = "stake") {
      this.setDialogTab(tab);
    },
    async showDialog() {
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.text-btn {
  font-weight: 700;
  width: max-content;
  padding: 0;
  color: var(--color-menu-inactive);
  font-size: 14px;
  transition: 0.3s ease color;
  border-radius: 0;
  border: 0;
  border-bottom-width: 1.5px;
  border-bottom-style: solid;
  border-bottom-color: transparent;
}
</style>
