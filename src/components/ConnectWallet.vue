<template>
  <div style="margin-top: 50px; max-width: 500px">
    <h2 style="text-align: center; margin-bottom: 0">
      Crunchy DeFi Wallet
    </h2>

    <h2 style="text-align: center; font-weight: 500 !important; font-size: 16px; margin: 5px 0 25px 0">
      Manage your entire Tezos portfolio from one convenient place.
    </h2>

    <el-row type="flex" justify="center">
      <el-button type="success" round plain @click="connectWallet"><i class="fad fa-wallet"></i> Connect Wallet</el-button>
    </el-row>

    <div style="margin-top: 26px">
      <h2 style="text-align: center; font-weight: 400 !important; font-size: 14px;">
        <span style="font-weight: 500">Disclaimer:</span> Information provided does not take into account the amount of liquidity available. Please make sure
        you check with the DEX you wish to trade at before making a trade.
      </h2>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "ConnectWallet",
  computed: {
    ...mapState(["wallet"]),
  },
  methods: {
    ...mapActions(["connectWallet"]),
  },
};
</script>

<style scoped></style>
