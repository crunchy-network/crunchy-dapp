<template>
  <div>
    <el-row type="flex" justify="space-between" :gutter="40">
      <el-col :xs="24" :md="7">
        <el-card v-loading="homeWallet.loading" class="top">
          <h2 style="font-weight: 600; font-size:16px; color: #757679ff">
            Net Worth
          </h2>

          <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
            {{ vueNumberFormat(homeWallet.netWorth, { prefix: "$", decimal: ".", thousand: ",", precision: 2 }) }}
          </h2>
        </el-card>
      </el-col>

      <el-col style="flex: 1;display: flex; justify-content: center; align-items: center">
        <el-divider direction="vertical"> </el-divider>
      </el-col>
      <el-col :xs="24" :md="7">
        <el-card v-loading="homeWallet.loading" class="top">
          <h2 style="font-weight: 600; font-size:16px; color: #757679ff">
            CRUNCH Balance
          </h2>

          <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
            {{ vueNumberFormat(homeWallet.crunchBal, { prefix: "", decimal: ".", thousand: ",", precision: 4 }) }}
          </h2>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="7">
        <el-card v-loading="homeWallet.loading" class="top">
          <h2 style="font-weight: 600; font-size:16px; color: #757679ff">
            crDAO Balance
          </h2>

          <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
            {{ vueNumberFormat(homeWallet.crDaoBal, { prefix: "", decimal: ".", thousand: ",", precision: 4 }) }}
          </h2>
        </el-card>
      </el-col>
    </el-row>

    <div class="tab-wrapper">
      <button class="tab-text" :style="isActiveTab('portfolio')" @click="setActiveTab('portfolio')">
        Portfolio
      </button>
      <button class="tab-text" disabled :style="isActiveTab('nfts')" @click="setActiveTab('nfts')">
        NFTs
      </button>
      <button class="tab-text" disabled :style="isActiveTab('farming')" @click="setActiveTab('farming')">
        Farming
      </button>
      <button class="tab-text" disabled :style="isActiveTab('history')" @click="setActiveTab('history')">
        History
      </button>
    </div>
    <div v-if="activeTab === 'portfolio'">
      <el-card v-loading="homeWallet.loading">
        <home-wallet-table
          :columns="[
            { name: 'Asset', accessor: 'asset', align: 'left', operation: insertAssetIcon, html: true },
            { name: 'Balance', accessor: 'balance', vnfConfig: { prefix: '', decimal: '.', thousand: ',', precision: 4 } },
            { name: 'Price', accessor: 'price', vnfConfig: { prefix: '$', decimal: '.', thousand: ',', precision: 2 } },
            { name: 'Value', accessor: 'value', vnfConfig: { prefix: '$', decimal: '.', thousand: ',', precision: 2 } },
            { name: '', accessor: '', html: true },
          ]"
          :data="homeWallet.assets"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import HomeWalletTable from "./HomeWalletTable.vue";
export default {
  components: { HomeWalletTable },
  name: "HomeWallet",
  data() {
    return {
      activeTab: "portfolio",
      tabledata: [],
    };
  },
  computed: {
    ...mapState(["homeWallet"]),
    ...mapActions(["loadWalletAsssets"]),
  },
  mounted() {
    this.loadWalletAsssets;
  },
  created() {
    setInterval(() => {
      this.reload();
    }, 1000 * 60 * 5);
  },
  methods: {
    reload() {
      this.loadWalletAsssets;
      this.homeWallet.loading;
    },
    isActiveTab(tab) {
      return this.activeTab === tab && " border-bottom: 6px solid #555CFF; color: #555CFF";
    },
    setActiveTab(tab = "") {
      if (["portfolio", "nfts", "farming", "history"].includes(tab)) {
        this.activeTab = tab;
      }
    },
    handleTrade() {
      return "<el-button style='color: #555CFF; font-weight: 600' type='text'> TRADE </el-button>";
    },
    insertAssetIcon(column) {
      return `<div style="max-width: 45px; max-height: 45px; display: flex; align-items:center"><img src="${column?.icon}" style="width: 100%; height: 100%; margin-right: 20px" alt=""> ${column?.asset}</div>`;
    },
    // formatTableUSD(_, item) {
    //   console.log(VueNumberFormat(item, { prefix: "$", decimal: ".", thousand: ",", precision: 4 }));
    //   return "";
    // },
  },
};
</script>

<style lang="scss" scoped>
.el-divider--vertical {
  height: 120% !important;
}

.el-card.top {
  box-shadow: unset !important;
  padding-left: 20px;
}

.tab-wrapper {
  display: flex;
  align-items: flex-start;
  border-bottom: 1.5px solid rgba(117, 118, 121, 0.1);
  margin: 46px 0 32px 0;
  padding: 0 90px;
  overflow: auto;
}

.tab-text {
  min-width: 100px;
  text-align: center;
  padding: 5px 20px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: #191b1f;
  cursor: pointer;
  transition: 0.3s ease all;
  margin: 0;
  border: 0;
  background: transparent;
  &:disabled {
    color: #191b1f66;
    cursor: not-allowed;
  }
}
</style>
