<template>
  <div id="nav-wallet" style="display: inline-block">
    <connect-button v-if="wallet.connected === false" />

    <el-popover
      v-if="wallet.connected === true"
      placement="bottom-end"
      title="My Wallet"
      width="300"
      trigger="hover"
      popper-class="wallet-popover"
    >
      <div>
        <p class="fs__16">
          {{ `${(wallet.balance.toNumber() / 1000000).toFixed(3)} ꜩ` }}
        </p>
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
              class="btn-alt__4"
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
          background: #eeefff;
          color: var(--wallet-color);
          border: 1px solid #555cff;
        "
        class="connected-button fw_5"
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

<style lang="scss">
.wallet-popover .el-popover__title {
  font-size: 14px !important;
}

.wallet-popover .switch-button {
  color: #555cff !important;
  background: transparent !important;
  border: 0;
  &:hover {
    background: transparent !important;
    border: 1px solid #555cff;
  }
}

#nav-wallet .connected-button:hover {
  background: #555cff !important;
  color: #fff !important;
}
html[data-theme="dark"] {
  #nav-wallet {
    .connected-button {
      background: rgba(255, 255, 255, 0.2) !important;
      &:hover {
        background: #555cff !important;
        color: #fff !important;
      }
    }
  }
}
</style>
