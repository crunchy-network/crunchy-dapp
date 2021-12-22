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
      <el-row type="flex" justify="space-between" :gutter="40">
        <el-col :xs="24" :md="7">
          <el-card class="top">
            <h2 style="font-weight: 600; font-size:16px; color: #757679ff">
              Net Worth
            </h2>

            <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
              $400,000
            </h2>
          </el-card>
        </el-col>

        <el-col style="flex: 1;display: flex; justify-content: center; align-items: center">
          <el-divider direction="vertical"> </el-divider>
        </el-col>
        <el-col :xs="24" :md="7">
          <el-card class="top">
            <h2 style="font-weight: 600; font-size:16px; color: #757679ff">
              CRUNCH Balance
            </h2>

            <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
              250,000
            </h2>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="7">
          <el-card class="top">
            <h2 style="font-weight: 600; font-size:16px; color: #757679ff">
              crDAO Balance
            </h2>

            <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
              1.3
            </h2>
          </el-card>
        </el-col>
      </el-row>

      <div class="tab-wrapper">
        <p class="tab-text" :style="isActiveTab('portfolio')" @click="setActiveTab('portfolio')">
          Portfolio
        </p>
        <p class="tab-text" :style="isActiveTab('nfts')" @click="setActiveTab('nfts')">
          NFTs
        </p>
        <p class="tab-text" :style="isActiveTab('farming')" @click="setActiveTab('farming')">
          Farming
        </p>
        <p class="tab-text" :style="isActiveTab('history')" @click="setActiveTab('history')">
          History
        </p>
      </div>
      <div>
        <el-card>
          <home-wallet-table
            :columns="[
              { name: 'Asset', accessor: 'asset', align: 'left', operation: insertAssetIcon, html: true },
              { name: 'Balance', accessor: 'balance' },
              {
                name: 'Price',
                accessor: 'price',
              },
              {
                name: 'Value',
                accessor: 'value',
              },
              { name: '', accessor: '', html: true, operation: handleTrade },
            ]"
            :data="tabledata"
          />
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script>
import HomeWalletTable from "./HomeWalletTable.vue";
import NavWallet from "./NavWallet.vue";
export default {
  components: { NavWallet, HomeWalletTable },
  name: "HomeWallet",
  data() {
    return {
      activeTab: "portfolio",
      tabledata: [
        {
          asset: "EASY",
          balance: "200,000",
          price: "$0.23",
          value: "$46,000",
          icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1640189402/samples/xksnrwhellld4rma4uc8.svg",
        },
        {
          asset: "GIF",
          balance: "50,000",
          price: "$1",
          value: "$50,000",
          icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1640189398/samples/bcwvt8dhfcns7hq9z2nc.svg",
        },
        {
          asset: "IDZ",
          balance: "10,000",
          price: "$0.40",
          value: "$4,000",
          icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1640189401/samples/osb32qhsrb1nocptmc3t.svg",
        },
        {
          asset: "CRUNCH",
          balance: "250,000",
          price: "$1.20",
          value: "$300,000",
          icon: "https://res.cloudinary.com/melvin-manni/image/upload/v1640189400/samples/ykojhvxwce82tm4n5rso.svg",
        },
      ],
    };
  },
  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab && " border-bottom: 6px solid #555CFF; color: #555CFF";
    },
    setActiveTab(tab = "") {
      if (["portfolio", "nfts", "farming", "history"].includes(tab)) {
        this.activeTab = tab;
      }
    },
    handleTrade() {
      return "<el-button style='color: #555CFF; font-weight: 600' type='text'> Trade </el-button>";
    },
    insertAssetIcon(column) {
      return `<img src="${column?.icon}" style="width: 50px; margin-right: 20px" alt=""> ${column?.asset}`;
    },
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
}
</style>
