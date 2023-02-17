<template>
  <div
    id="nft-wallet-view"
    style="min-height: 50vh; display: flex; flex-direction: column"
  >
    <el-card v-loading="getLpLoading">
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
            "
          >
            <el-col :span="24">
              <el-row
                :gutter="20"
                type="flex"
                align="middle"
                style="padding: 0 20px; color: var(--color-subheading-text)"
              >
                <el-col :span="4">DEX</el-col>
                <el-col style="text-align: right" :span="4"></el-col>
                <el-col style="text-align: right" :span="4">Positions</el-col>
                <el-col style="text-align: right" :span="4"></el-col>
                <el-col style="text-align: right" :span="4">Total Value</el-col>
                <el-col style="text-align: right" :span="4"></el-col>
              </el-row>
            </el-col>
          </el-row>

          <LiquidityWalletRow
            v-for="(lp, index) in tabledata"
            :key="index"
            :show-usd="showUsd"
            :lp="lp"
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
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import LiquidityWalletRow from "./LiquidityWalletRow.vue";
import TablePagination from "./TablePagination.vue";

export default {
  name: "LiquidityWalletView",
  components: { LiquidityWalletRow, TablePagination },
  props: {
    showUsd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      tabledata: [],
      displayCount: 12,
      liquidity: [
        {
          id: "2",
          dex: "Plenty",
          isPlentyLp: true,
          thumbnailUri:
            "https://res.cloudinary.com/melvin-manni/image/upload/v1645292809/nstgjnest4jrhcsgwymf.png",
          positionsCount: "2",
          totalValue: 400.4,
          totalValueUsd: 744.95326,
          positions: [],
        },
        {
          dex: "Youves",
          isYouvesLp: true,
          thumbnailUri:
            "https://res.cloudinary.com/melvin-manni/image/upload/v1660017312/sathlsrqehsjnvv0w8wv.svg",
          totalValue: 241.2,
          totalValueUsd: 473.9087,
          positionsCount: "1",
          positions: [],
        },
        {
          dex: "Vortex",
          isVortexLp: true,
          thumbnailUri:
            "https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3533877337-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FyX7WTYr0YMeQcemP26Of%252Ficon%252F76rbNGaJiDxSJwFIjsLQ%252FGroup%25201494.png%3Falt%3Dmedia%26token%3D829a380f-2d70-4ceb-ac23-8c2aaddf8fe5",
          totalValue: 0,
          totalValueUsd: 0,
          positionsCount: "1",
          positions: [],
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getLpLoading", "getLp"]),
  },
  watch: {
    getLp() {
      this.paginationHandler();
    },
  },

  created() {
    setInterval(() => {
      this.softLoadAllLiquidity(this.$route.params.walletAddress);
    }, 1000 * 60 * 5);
  },

  mounted() {
    this.paginationHandler();
  },
  methods: {
    ...mapActions(["softLoadAllLiquidity"]),
    paginationHandler() {
      this.pages = Math.ceil(this.getLp.length / this.displayCount);
      this.handleVisibleData();
    },
    handleVisibleData() {
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = this.getLp.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > this.getLp.length
          ? this.getLp.length
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
</style>
