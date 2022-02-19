<template>
  <div>
    <el-row type="flex" justify="space-between" :gutter="40">
      <el-col :xs="24" :md="7">
        <el-card v-loading="homeWallet.loading" class="top">
          <h2 style="font-weight: 600; font-size: 16px; color: #757679ff">
            Net Worth
          </h2>

          <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
            {{
              !showUsd
                ? vueNumberFormat(homeWallet.netWorth, {
                    prefix: "",
                    suffix: " ꜩ",
                    decimal: ".",
                    thousand: ",",
                    precision: 4,
                  })
                : vueNumberFormat(homeWallet.netWorthUsd, {
                    prefix: "$",
                    decimal: ".",
                    thousand: ",",
                    precision: 2,
                  })
            }}
          </h2>
        </el-card>
      </el-col>

      <el-col
        style="
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <el-divider direction="vertical"> </el-divider>
      </el-col>
      <el-col :xs="24" :md="7">
        <el-card v-loading="homeWallet.loading" class="top">
          <h2 style="font-weight: 600; font-size: 16px; color: #757679ff">
            CRUNCH Balance
          </h2>

          <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
            {{
              vueNumberFormat(homeWallet.crunchBal, {
                prefix: "",
                decimal: ".",
                thousand: ",",
                precision: 4,
              })
            }}
          </h2>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="7">
        <el-card v-loading="homeWallet.loading" class="top">
          <h2 style="font-weight: 600; font-size: 16px; color: #757679ff">
            crDAO Balance
          </h2>

          <h2 style="font-weight: 600; font-size: 28px; margin-bottom: 0">
            {{
              vueNumberFormat(homeWallet.crDaoBal, {
                prefix: "",
                decimal: ".",
                thousand: ",",
                precision: 4,
              })
            }}
          </h2>
        </el-card>
      </el-col>
    </el-row>

    <el-row
      style="
        margin: 46px 0 32px 0;
        border-bottom: 1.5px solid rgba(117, 118, 121, 0.1);
        align-items: center;
      "
      :gutter="20"
      type="flex"
      justify="space-between"
      align="bottom"
    >
      <div class="tab-wrapper">
        <button
          class="tab-text"
          :style="isActiveTab('portfolio')"
          @click="setActiveTab('portfolio')"
        >
          Portfolio
        </button>
        <button
          class="tab-text"
          :style="isActiveTab('nfts')"
          @click="setActiveTab('nfts')"
        >
          NFTs
        </button>
        <button
          class="tab-text"
          :style="isActiveTab('staked')"
          @click="setActiveTab('staked')"
        >
          Staked
        </button>
        <button
          class="tab-text"
          disabled
          :style="isActiveTab('history')"
          @click="setActiveTab('history')"
        >
          History
        </button>
      </div>
      <div class="grid-content" style="text-align: right">
        <el-switch
          v-model="showUsd"
          :disabled="homeWallet.loading"
          style="margin-right: 24px"
          active-color="#1EC37F"
          inactive-color="#555CFF"
          active-text="USD"
          inactive-text="XTZ"
        >
        </el-switch>
      </div>
    </el-row>

    <div v-if="activeTab === 'portfolio'">
      <el-card v-loading="homeWallet.loading">
        <div>
          <div>
            <el-row
              type="flex"
              align="middle"
              style="
                color: #757679;
                font-size: 14px;
                font-weight: 600;
                border-bottom: 2px solid #f4f4f4;
                padding-bottom: 14px;
                margin-bottom: 14px;
              "
            >
              <el-col :span="24">
                <el-row
                  :gutter="20"
                  type="flex"
                  align="middle"
                  style="padding: 0 20px"
                >
                  <el-col :span="6">Asset</el-col>
                  <el-col style="text-align: right" :span="5">Balance</el-col>
                  <el-col style="text-align: right" :span="5">Price </el-col>
                  <el-col style="text-align: right" :span="5">Value</el-col>
                  <el-col style="text-align: right" :span="3"></el-col>
                </el-row>
              </el-col>
            </el-row>

            <PortfolioWalletRow
              v-for="(asset, index) in tabledata"
              :key="index"
              :asset="asset"
              :show-usd="showUsd"
            />
            <div id="pagination">
              <el-button
                :disabled="currentPage === 0"
                style="margin-right: 12px"
                @click="handleStart"
              >
                <i class="fal fa-angle-left"></i>
                <i class="fal fa-angle-left"></i>
              </el-button>
              <el-button :disabled="currentPage === 0" @click="handlePrevPage">
                <i class="fal fa-angle-left"></i>
              </el-button>

              <h2
                style="
                  font-weight: 800;
                  font-size: 14px;
                  color: #191b1f;
                  opacity: 0.5;
                  margin: 0 19px;
                "
              >
                {{
                  vueNumberFormat(nextPage > pages ? pages : nextPage, {
                    prefix: "",
                    decimal: ".",
                    thousand: ",",
                    precision: 0,
                  })
                }}
                out of
                {{
                  vueNumberFormat(pages, {
                    prefix: "",
                    decimal: ".",
                    thousand: ",",
                    precision: 0,
                  })
                }}
              </h2>
              <el-button
                :disabled="nextPage + 1 > pages"
                @click="handleNextPage"
              >
                <i class="fal fa-angle-right"></i>
              </el-button>

              <el-button
                :disabled="nextPage + 1 > pages"
                style="margin-left: 12px"
                @click="handleEnd"
              >
                <i class="fal fa-angle-right"></i>
                <i class="fal fa-angle-right"></i>
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <div v-if="activeTab === 'nfts'">
      <nft-wallet-view></nft-wallet-view>
    </div>

    <div v-if="activeTab === 'staked'">
      <staked-wallet :show-usd="showUsd"></staked-wallet>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import NftWalletView from "./NftWalletView.vue";
// import HomeWalletTable from "./HomeWalletTable.vue";
import PortfolioWalletRow from "./PortfolioWalletRow.vue";
import StakedWallet from "./StakedWallet.vue";
export default {
  name: "HomeWallet",
  components: { PortfolioWalletRow, NftWalletView, StakedWallet },
  data() {
    return {
      activeTab: "staked",
      tabledata: [],
      showUsd: false,
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      displayCount: 12,
    };
  },
  computed: {
    ...mapState(["homeWallet"]),
    ...mapGetters(["getPkh", "getAssets"]),
  },
  watch: {
    getPkh() {
      this.refresh();
    },
    getAssets() {
      this.paginationHandler();
    },
    "$route.params.walletAddress": {
      immediate: true,
      handler() {
        this.refresh();
      },
    },
  },
  created() {
    this.refresh();
  },
  methods: {
    ...mapActions(["loadWalletAsssets"]),

    refresh() {
      this.loadWalletAsssets(this.$route.params.walletAddress);
    },

    isActiveTab(tab) {
      return (
        this.activeTab === tab &&
        " border-bottom: 6px solid #555CFF; color: #555CFF"
      );
    },

    setActiveTab(tab = "") {
      if (["portfolio", "nfts", "staked", "history"].includes(tab)) {
        this.activeTab = tab;
      }
    },

    paginationHandler() {
      this.pages = Math.ceil(this.homeWallet.assets.length / this.displayCount);
      this.handleVisibleData();
    },

    handleVisibleData() {
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = this.homeWallet.assets.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > this.homeWallet.assets.length
          ? this.homeWallet.assets.length
          : next * this.displayCount
      );
    },

    handleNextPage() {
      if (this.nextPage + 1 <= this.pages) {
        this.currentPage = this.nextPage;
        this.prevPage = this.nextPage - 1;
        this.nextPage = this.nextPage + 1;
        this.handleVisibleData();
      }
    },

    handlePrevPage() {
      if (this.currentPage > 0) {
        this.currentPage = this.prevPage;
        this.nextPage = this.prevPage + 1;
        this.prevPage = this.prevPage - 1;
        this.handleVisibleData();
      }
    },

    handleEnd() {
      if (this.currentPage !== this.pages) {
        this.currentPage = this.pages;
        this.nextPage = this.pages;
        this.prevPage = this.pages - 1;
        this.handleVisibleData();
      }
    },

    handleStart() {
      if (this.currentPage !== 0) {
        this.currentPage = 0;
        this.nextPage = 1;
        this.prevPage = 0;
        this.handleVisibleData();
      }
    },
    resetPagination() {
      this.currentPage = 0;
      this.pages = 0;
      this.nextPage = 1;
      this.prevPage = 0;
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
  padding: 0 0 0 90px;
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

#pagination {
  margin-top: 32px;
  padding: 20px 0 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid rgba(25, 27, 31, 0.05);
  .el-button {
    width: 42px;
    height: 42px;
    color: rgba(25, 27, 31, 0.5);
    padding: 13px;
    background: rgba(25, 27, 31, 0.04);
    border: 1px solid rgba(25, 27, 31, 0.2);
    box-sizing: border-box;
    border-radius: 8px;
  }
}

.el-input__inner {
  border-radius: 28px;
}
</style>
