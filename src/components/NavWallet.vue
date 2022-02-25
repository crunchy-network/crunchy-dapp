<template>
  <div style="display: inline-block">
    <el-button
      class="wallet-btn"
      v-if="wallet.connected === false"
      round
      @click="connectWallet"
      ><i class="fad fa-wallet"></i> Connect Wallet</el-button
    >
    <el-avatar
      v-if="wallet.connected === false"
      src="https://www.tinygraphs.com/labs/isogrids/hexa/crunchy.network?theme=base&numcolors=4&size=220&fmt=svg"
      style="vertical-align: middle; margin-left: 12px; background: #fff"
    ></el-avatar>
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
        style="background: transparent"
        slot="reference"
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
    <el-avatar
      v-if="wallet.connected === true"
      :src="`https://www.tinygraphs.com/labs/isogrids/hexa/${wallet.pkh}?theme=heatwave&numcolors=4&size=220&fmt=svg`"
      style="vertical-align: middle; margin-left: 12px; background: #fff"
    ></el-avatar>
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
