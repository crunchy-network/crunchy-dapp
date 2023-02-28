<template>
  <el-dialog width="400px" :modal="true" :visible.sync="visible">
    <div
      class="box-card"
      style="flex: 1; display: flex; flex-direction: column"
    >
      <div style="margin-bottom: 24px; display: flex; align-items: end">
        <el-button
          class="text-btn"
          type="text"
          :style="
            stakeTab === 'stake' &&
            'border-bottom-color: var(--color-menu-active); color: var(--color-menu-active);'
          "
          @click="switchStakeTab('stake')"
        >
          Stake
        </el-button>
        <el-button
          class="text-btn"
          type="text"
          :style="
            stakeTab === 'restake' &&
            'border-bottom-color: var(--color-menu-active); color: var(--color-menu-active);'
          "
          @click="switchStakeTab('restake')"
        >
          Re-Stake
        </el-button>
      </div>

      <div>
        <crnchy-stake v-if="stakeTab === 'stake'"></crnchy-stake>
        <crnchy-restake v-if="stakeTab === 'restake'"></crnchy-restake>
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

  data() {
    return {
      visible: true,
      stakeTab: "stake",
    };
  },

  methods: {
    switchStakeTab(tab = "stake") {
      this.stakeTab = tab;
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