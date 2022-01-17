<template>
  <div>
    <el-header style="position: fixed; height: 90px; top: 0; left: 230px; right: 0; background: #fff; z-index: 999;">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right;">
            <nav-wallet />
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </el-header>

    <el-main style="margin-top: 100px">
      <div v-if="wallet.connected === false">
        <connect-wallet />
      </div>
      <div v-if="wallet.connected">
        <home-wallet />
      </div>
    </el-main>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConnectWallet from "./ConnectWallet.vue";
import HomeWallet from "./HomeWallet.vue";
import NavWallet from "./NavWallet.vue";

export default {
  components: { NavWallet, ConnectWallet, HomeWallet },
  name: "HomeWalletPage",
  computed: {
    ...mapState(["wallet"]),
  },
};
</script>

<style scoped></style>
