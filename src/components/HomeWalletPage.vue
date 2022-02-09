<template>
  <div id="home-wallet">
    <!-- class="hidden-sm-and-down" -->
    <el-header
      style="
        position: fixed;
        height: 90px;
        top: 0;
        left: 230px;
        right: 0;
        background: #fff;
        z-index: 999;
        border-bottom: 1px solid #e8e8e9;
      "
    >
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12"></el-col>
        <el-col :span="12">
          <div class="grid-content" style="text-align: right">
            <NavWallet />
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-main style="margin-top: 100px">
      <div v-if="wallet.connected || $route.params.walletAddress">
        <home-wallet />
      </div>
      <div v-else>
        <el-row type="flex" justify="center">
          <connect-wallet />
        </el-row>
      </div>
    </el-main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ConnectWallet from "./ConnectWallet.vue";
import HomeWallet from "./HomeWallet.vue";
import NavWallet from "./NavWallet.vue";

export default {
  name: "HomeWalletPage",
  components: { NavWallet, ConnectWallet, HomeWallet },
  computed: {
    ...mapState(["wallet"]),
  },
};
</script>

<style scoped>
#home-wallet {
  position: relative;
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
}
</style>
