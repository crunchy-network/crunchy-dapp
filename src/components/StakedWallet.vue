<template>
  <div
    id="nft-wallet-view"
    style="min-height: 50vh; display: flex; flex-direction: column"
  >
    <el-card v-loading="homeWallet.loadingStake" shadow="always">
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
                <el-col :span="4">Protocol</el-col>
                <el-col style="text-align: right" :span="4"></el-col>
                <el-col style="text-align: right" :span="4"
                  >Staked Value</el-col
                >
                <el-col style="text-align: right" :span="4"></el-col>
                <el-col style="text-align: right" :span="4">Total Value</el-col>
                <el-col style="text-align: right" :span="4"></el-col>
              </el-row>
            </el-col>
          </el-row>

          <StakedWalletRow
            v-for="(farm, index) in tabledata"
            :key="index"
            :show-usd="showUsd"
            :farm="farm"
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
import { mapActions, mapGetters, mapState } from "vuex";
import StakedWalletRow from "./StakedWalletRow.vue";
import TablePagination from "./TablePagination.vue";
export default {
  name: "StakedWalletView",
  components: { StakedWalletRow, TablePagination },
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

      farms: [],
    };
  },
  computed: {
    ...mapState(["homeWallet"]),
    ...mapGetters(["getStakes"]),
  },
  watch: {
    getStakes() {
      this.paginationHandler();
    },

    farms(newVal) {
      this.paginationHandler();
    },
  },
  created() {
    setInterval(() => {
      this.softUpdateStakeAssets(this.$route.params.walletAddress);
    }, 1000 * 60 * 10);
  },
  mounted() {
    this.paginationHandler();
  },
  methods: {
    ...mapActions(["softUpdateStakeAssets"]),
    paginationHandler() {
      this.pages = Math.ceil(this.getStakes.length / this.displayCount);
      this.handleVisibleData();
    },

    handleVisibleData() {
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = this.getStakes.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > this.farms.length
          ? this.getStakes.length
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

<style lang="scss" scoped></style>
