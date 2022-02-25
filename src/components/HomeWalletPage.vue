<template>
  <div id="home-wallet">
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

export default {
  name: "HomeWalletPage",
  components: { ConnectWallet, HomeWallet },
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
