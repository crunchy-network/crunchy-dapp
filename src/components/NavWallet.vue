<template>
  <div style="display: inline-block">
    <el-button
      v-if="wallet.connected === false"
      class="wallet-btn"
      round
      @click="connectWallet"
      ><i class="fad fa-wallet"></i> Connect Wallet</el-button
    >
    <el-popover
      v-if="wallet.connected === true"
      popper-class="nav-wallet"
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
            <el-button type="text" size="mini" round plain @click="changeWallet"
              >Switch Account</el-button
            >
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button
              style="background: transparent"
              type="danger"
              round
              @click="disconnectWallet"
              >Disconnect</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-button
        slot="reference"
        style="background: transparent"
        type="primary"
        round
      >
        {{
          $async(wallet.pkhDomain, `tez-domain-${wallet.pkh}`) ||
          `${wallet.pkh.substr(0, 6)}...${wallet.pkh.substr(-6)}`
        }}
        <i class="fad fa-angle-down fa-icon-right"></i>
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "NavWallet",
  computed: {
    ...mapState(["wallet"]),
  },
  methods: {
    ...mapActions(["connectWallet", "disconnectWallet", "changeWallet"]),
  },
};
</script>

<style lang="scss" scoped></style>
