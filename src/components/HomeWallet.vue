<template>
  <div>
    <HomeWalletStats :loading="homeWallet.loading" :show-usd="showUsd" />
    <el-row
      style="
        margin: 36px 0 22px 0;
        border-bottom: var(--line-border);
        align-items: center;
        flex-wrap: wrap-reverse;
        gap: 10px;
      "
      :gutter="20"
      type="flex"
      justify="space-between"
      align="bottom"
    >
      <el-select
        v-model="activeTab"
        class="tab-select-element"
        placeholder="Select Tab"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="tab-wrapper tab-custom-element">
        <button
          class="tab-text"
          :style="isActiveTab('wallet')"
          @click="setActiveTab('wallet')"
        >
          Wallet
        </button>
        <!-- <button
          class="tab-text"
          :style="isActiveTab('staking')"
          @click="setActiveTab('staking')"
        >
          Staked
        </button> -->

        <button
          class="tab-text"
          :style="isActiveTab('liquidity')"
          @click="setActiveTab('liquidity')"
        >
          Liquidity
        </button>

        <button
          class="tab-text"
          :style="isActiveTab('nfts')"
          @click="setActiveTab('nfts')"
        >
          NFTs
        </button>

        <a
          class="tab-text"
          style="color: var(--link-btn-color); text-decoration: none"
          :href="`https://tzkt.io/${$route.params.walletAddress || getPkh}`"
          target="_blank"
        >
          History
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85714 1.71408C6.85714 1.24077 7.24018 0.856934 7.71429 0.856934H11.1188C11.258 0.856934 11.3705 0.879969 11.4696 0.922023C11.5473 0.963541 11.6652 1.02488 11.7482 1.10604C11.7482 1.10738 11.7482 1.10872 11.7509 1.10979C11.917 1.2764 11.9759 1.4939 12 1.7114C12 1.71247 12 1.71327 12 1.71408V5.14265C12 5.61676 11.617 5.99979 11.1429 5.99979C10.6687 5.99979 10.2857 5.61676 10.2857 5.14265V3.78461L5.74821 8.31943C5.41339 8.65426 4.87232 8.65426 4.5375 8.31943C4.20268 7.98461 4.20268 7.44354 4.5375 7.10872L9.07232 2.57122H7.71429C7.24018 2.57122 6.85714 2.18738 6.85714 1.71408ZM0 3.42836C0 2.48149 0.767411 1.71408 1.71429 1.71408H4.28571C4.75982 1.71408 5.14286 2.09792 5.14286 2.57122C5.14286 3.04533 4.75982 3.42836 4.28571 3.42836H1.71429V11.1426H9.42857V8.57122C9.42857 8.09711 9.81161 7.71408 10.2857 7.71408C10.7598 7.71408 11.1429 8.09711 11.1429 8.57122V11.1426C11.1429 12.0882 10.3741 12.8569 9.42857 12.8569H1.71429C0.767411 12.8569 0 12.0882 0 11.1426V3.42836Z"
              fill="var(--link-btn-color)"
            />
          </svg>
        </a>
      </div>
    </el-row>

    <div v-if="activeTab === 'wallet'">
      <el-card v-loading="homeWallet.loading" shadow="always">
        <div class="responsive-table">
          <div>
            <el-row
              type="flex"
              align="middle"
              style="
                font-size: 14px;
                font-weight: 600;
                border-bottom: var(--line-border);
                padding-bottom: 14px;
                margin-bottom: 14px;
                min-width: 900px;
              "
            >
              <el-col :span="24">
                <el-row
                  class="portfolio-row"
                  :gutter="20"
                  type="flex"
                  align="middle"
                  style="
                    padding: 0 20px;
                    color: var(--color-subheading-text) !important;
                  "
                >
                  <el-col :span="4">Asset</el-col>
                  <el-col style="text-align: right" :span="4">Balance</el-col>
                  <el-col style="text-align: right" :span="4">Price</el-col>
                  <el-col style="text-align: right" :span="4">Value</el-col>
                  <el-col style="text-align: right" :span="2"
                    >1d
                    <el-tooltip
                      :content="`% Change in ${showUsd ? 'USD' : 'XTZ'}`"
                      placement="top"
                      effect="light"
                    >
                      <i class="fa-regular fa-info-circle"></i>
                    </el-tooltip>
                  </el-col>
                  <el-col style="text-align: right" :span="2"
                    >7d
                    <el-tooltip
                      :content="`% Change in ${showUsd ? 'USD' : 'XTZ'}`"
                      placement="top"
                      effect="light"
                    >
                      <i class="fa-regular fa-info-circle"></i>
                    </el-tooltip>
                  </el-col>
                  <el-col style="text-align: right" :span="2"
                    >30d
                    <el-tooltip
                      :content="`% Change in ${showUsd ? 'USD' : 'XTZ'}`"
                      placement="top"
                      effect="light"
                    >
                      <i class="fa-regular fa-info-circle"></i>
                    </el-tooltip>
                  </el-col>
                  <el-col style="text-align: right" :span="2"></el-col>
                </el-row>
              </el-col>
            </el-row>

            <PortfolioWalletRow
              v-for="(asset, index) in tabledata"
              :key="index"
              :asset="asset"
              :show-usd="showUsd"
            />
            <table-pagination
              :current-page="currentPage"
              :next-page="nextPage"
              :pages="pages"
              :handle-next-page="handleNextPage"
              :handle-prev-page="handlePrevPage"
              :handle-start="handleStart"
              :handle-end="handleEnd"
            />
          </div>
        </div>
      </el-card>
    </div>

    <div v-if="activeTab === 'staking'">
      <staked-wallet :show-usd="showUsd"></staked-wallet>
    </div>
    <div v-if="activeTab === 'nfts'">
      <NftWalletView />
    </div>
    <div v-if="activeTab === 'liquidity'">
      <LiquidityWallet :show-usd="showUsd" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import PortfolioWalletRow from "./PortfolioWalletRow.vue";
import StakedWallet from "./StakedWallet.vue";
import NftWalletView from "./NftWalletView.vue";
import LiquidityWallet from "./LiquidityWallet.vue";
import HomeWalletStats from "./HomeWalletStats.vue";
import TablePagination from "./TablePagination.vue";

export default {
  name: "HomeWallet",
  components: {
    PortfolioWalletRow,
    StakedWallet,
    NftWalletView,
    HomeWalletStats,
    LiquidityWallet,
    TablePagination,
  },
  data() {
    return {
      activeTab: "wallet",
      tabledata: [],
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      displayCount: 12,
      options: [
        {
          value: "wallet",
          label: "Wallet",
        },
        {
          value: "staking",
          label: "Staking",
        },
        {
          value: "liquidity",
          label: "Liquidity",
        },
        {
          value: "nfts",
          label: "NFTs",
        },
      ],
    };
  },
  computed: {
    ...mapState(["homeWallet"]),
    ...mapGetters(["getPkh", "getAssets", "getStakedValues", "getShowUsd"]),
    showUsd() {
      return this.getShowUsd;
    },
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
    ...mapActions(["loadWalletAsssets", "loadStakeAssets", "loadAllLiquidity"]),

    refresh() {
      this.loadWalletAsssets(this.$route.params.walletAddress);
      this.loadAllLiquidity(this.$route.params.walletAddress);
      this.loadStakeAssets(this.$route.params.walletAddress);
    },

    isActiveTab(tab) {
      return (
        this.activeTab === tab &&
        " border-bottom: 3px solid var(--color-menu-active); color: var(--color-menu-active); font-weight: 700"
      );
    },

    setActiveTab(tab = "") {
      if (["wallet", "staking", "liquidity", "nfts"].includes(tab)) {
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
}

.tab-text {
  min-width: 100px;
  text-align: center;
  padding: 2px 20px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: var(--color-menu-inactive);
  cursor: pointer;
  transition: 0.3s ease all;
  margin: 0;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  &:disabled {
    color: var(--color-menu-inactive);
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.divider {
  opacity: 0.26;
}

.divider .el-divider.el-divider--horizontal {
  margin: 0 !important;
}

.el-input__inner {
  border-radius: 28px;
}

.tab-select-element {
  display: none;
  width: 100%;
}

@media (max-width: 600px) {
  .tab-select-element {
    display: block;
  }

  .tab-custom-element {
    display: none;
  }
}
@media (max-width: 450px) {
  .responsive-table > div {
    min-width: 900px;
  }
  .portfolio-row {
    display: flex;
    justify-content: space-between;
  }
  .portfolio-row .el-col:nth-child(1) {
    position: sticky;
    left: 0px;
    z-index: 1;
    background-color: #191b1f;
  }
}
</style>
