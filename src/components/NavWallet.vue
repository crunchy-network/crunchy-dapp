<template>
  <div style="display: inline-block">
    <connect-button v-if="wallet.connected === false" />

    <el-popover
      v-if="wallet.connected === true"
      placement="bottom-end"
      title="My Wallet"
      width="300"
      trigger="hover"
    >
      <div>
        <strong>{{
          `${(wallet.balance.toNumber() / 1000000).toFixed(3)} ꜩ`
        }}</strong>
        <el-divider></el-divider>
        <el-row type="flex" align="middle" justify="space-between">
          <el-col :span="12">
            <el-button
              type="text"
              size="mini"
              class="switch-button"
              round
              plain
              @click="changeWallet"
              >Switch Account</el-button
            >
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button
              type="danger"
              size="mini"
              class="disconnect-button"
              round
              plain
              @click="disconnectWallet"
              >Disconnect</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-button
        slot="reference"
        style="
          background: var(--background-wallet);
          color: var(--wallet-color);
          border: var(--wallet-border);
        "
        type="primary"
        round
        plain
      >
        {{
          $async(wallet.pkhDomain, `tez-domain-${wallet.pkh}`) ||
          `${wallet.pkh.substr(0, 6)}...${wallet.pkh.substr(-6)}`
        }}
        <!-- <i class="fad fa-angle-down fa-icon-right"></i> -->
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ConnectButton from "./ConnectButton.vue";

export default {
  name: "NavWallet",
  components: { ConnectButton },
  computed: {
    ...mapState(["wallet"]),
  },
  methods: {
    ...mapActions(["connectWallet", "disconnectWallet", "changeWallet"]),
  },
};
</script>

<style lang="scss" scoped>
html[data-theme="dark"] .switch-button {
  border: 1px solid #555cff;
}
html[data-theme="dark"] .disconnect-button {
  background-color: transparent !important;
  border: 1px solid var(--color-menu-active);
  color: var(--color-menu-active);
  &:hover {
    background-color: #feeded !important;
  }
}
</style>
