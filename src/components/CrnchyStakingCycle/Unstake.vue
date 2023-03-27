<template>
  <div>
    <template v-if="confirm">
      <h2 style="margin: 0">Confirm CRNCHY Unstake</h2>
      <p class="color__subheading fs__14">
        Please confirm your unstaking details below.
      </p>

      <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
        <div class="row">
          <small> CRNCHY to Unlock: </small>
          <h2 class="fs__18 color__success">56,056.528</h2>
        </div>
        <div class="row text__right">
          <small>crVOTE to Burn:</small>
          <h2 class="fs__18 color__danger">566.528</h2>
        </div>
      </el-row>

      <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
        <div class="row">
          <small>New Pool Ownership:</small>
          <h2 class="fs__18">1.21 %</h2>
        </div>
      </el-row>

      <div class="my__24">
        <el-divider></el-divider>
      </div>

      <el-row :gutter="5" type="flex" justify="space-between">
        <div class="row">
          <small> CRNCHY Still Staked : </small>
          <h2 class="fs__18">543.23</h2>
        </div>
        <div class="row text__right">
          <small>crVOTE Still Owned:</small>
          <h2 class="fs__18">433.23</h2>
        </div>
      </el-row>
    </template>
    <template v-else>
      <h2 style="margin: 0">Unstake CRNCHY</h2>
      <p class="color__subheading fs__14">
        Select an amount of CRNCHY to unlock.
      </p>

      <div class="mt__24">
        <p class="color__subheading fs__14 fw__7">Date Unlocked</p>
        <p class="fs__16 fw__7">12 March 2022 14:23 UTC</p>
      </div>

      <div class="mt__24">
        <crnchy-stake-input>
          <p class="color__subheading fs__14 fw__7">CRNCHY to Unlock</p>
        </crnchy-stake-input>
      </div>

      <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
        <div class="row">
          <small> crVOTE Needed to Unlock: </small>
          <h2 class="fs__16">543.23</h2>
        </div>
        <div class="row text__right">
          <small>New Pool Share:</small>
          <h2 class="fs__16">1.21 %</h2>
        </div>
      </el-row>
    </template>
    <div class="my__24 lock-display _info-card">
      <p class="color__subheading fs__12 text__center">
        Once you unstake your tokens, you will need to stake and lock your
        tokens again to earn rewards and voting power.
      </p>
    </div>
    <template v-if="confirm">
      <el-row type="flex" justify="center" style="gap: 40px"  >
        <el-button
          round
          type="primary"
          class="btn-alt__3"
          @click="confirm = false"
        >
          Back
        </el-button>

        <el-button round type="primary"> Unstake CRNCHY </el-button>
      </el-row>
    </template>
    <div v-else class="row__center">
      <el-button type="primary" round @click="() => (confirm = true)">
        Unstake CRNCHY
      </el-button>
    </div>
  </div>
</template>

<script>
import CrnchyStakeInput from "./CrnchyStakeInput.vue";
export default {
  name: "Unstake",
  components: { CrnchyStakeInput },

  data() {
    return {
      confirm: false,
    };
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
}
small {
  color: var(--color-subheading-text);
  font-weight: 700;
  font-size: 14px;
}
</style>
