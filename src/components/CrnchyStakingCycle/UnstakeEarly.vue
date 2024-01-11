<template>
  <div>
    <template v-if="confirm">
      <h2 style="margin: 0">Confirm Early CRNCHY Unstake</h2>
      <p class="color__subheading fs__14">
        Please confirm your early unstake details below.
      </p>

      <el-row :gutter="5" type="flex" justify="space-between" class="my__24">
        <div class="row">
          <small> Amount to be Unlocked: </small>
          <h2 class="fs__18 color__success">56,056.528</h2>
        </div>
        <div class="row text__right">
          <small>Amount Remaining Staked:</small>
          <h2 class="fs__18">56,056.528 CRNCHY</h2>
        </div>
      </el-row>

      <el-row :gutter="5" type="flex" justify="space-between">
        <div class="row">
          <small> Unlock Fee to Burn : </small>
          <h2 class="fs__18 color__danger">84,084.792 CRNCHY</h2>
        </div>
        <div class="row text__right">
          <small>New Pool Ownership:</small>
          <h2 class="fs__18">1.23 %</h2>
        </div>
      </el-row>
    </template>
    <template v-else>
      <h2 style="margin: 0">Unstake CRNCHY Early</h2>
      <p class="color__subheading fs__14">
        If you wish to unstake your CRNCHY earlier than your previously agreed
        upon locked time, you can pay an early unlock fee. The fee is calculated
        based on how much time is remaining on your current lock and is deducted
        from your staked amount.
      </p>

      <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
        <div class="row">
          <small> Original Lock Date: </small>
          <h2 class="fs__16">12 March 2022 14:23 UTC</h2>
        </div>
        <div class="row text__right">
          <small>Current Unlock Date:</small>
          <h2 class="fs__16">12 March 2022 14:23 UTC</h2>
        </div>
      </el-row>
      <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
        <div class="row">
          <small> Amount Locked: </small>
          <h2 class="fs__16">140,141.32 CRNCHY</h2>
        </div>
        <div class="row text__right">
          <small>% of Time Remaining:</small>
          <h2 class="fs__16">60%</h2>
        </div>
      </el-row>

      <div class="mt__24">
        <crnchy-stake-input>
          <p class="color__subheading fs__14 fw__7">CRNCHY to Unlock</p>
        </crnchy-stake-input>
      </div>

      <el-row :gutter="5" type="flex" justify="space-between" class="mt__24">
        <div class="row">
          <small> Unlock Fee to Burn: </small>
          <h2 class="fs__16 color__success">140,141.32 CRNCHY</h2>
        </div>
        <div class="row text__right">
          <small>Amount that Will Unlock:</small>
          <h2 class="fs__16 color__danger">56,056.528 CRNCHY</h2>
        </div>
      </el-row>
    </template>
    <div class="my__24 lock-display _info-card">
      <p class="color__subheading fs__12 text__center">
        You are unstaking your tokens early. YOU WILL BE CHARGED AN EARLY UNLOCK
        FEE THAT IS DEDUCTED FROM THE TOKENS YOU HAVE STAKED. Please make sure
        you pay close attention to the breakdown above before you unstake early.
      </p>
    </div>
    <template v-if="confirm">
      <el-row type="flex" justify="center" style="gap: 40px">
        <el-button
          round
          type="primary"
          class="btn-alt__3"
          @click="confirm = false"
        >
          Back
        </el-button>

        <el-button round type="primary"> Unstake Early </el-button>
      </el-row>
    </template>
    <div v-else class="row__center">
      <el-button type="primary" round @click="() => (confirm = true)">
        Unstake Early
      </el-button>
    </div>
  </div>
</template>

<script>
import CrnchyStakeInput from "./CrnchyStakeInput.vue";
export default {
  name: "UnstakeEarly",
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
