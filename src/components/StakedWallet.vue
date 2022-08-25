<template>
  <div
    id="nft-wallet-view"
    style="min-height: 50vh; display: flex; flex-direction: column"
  >
    <el-card v-loading="homeWallet.loadingStake" shadow="always" >
      <div class="responsive-table">
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
            <el-button :disabled="nextPage + 1 > pages" @click="handleNextPage">
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
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import StakedWalletRow from "./StakedWalletRow.vue";
export default {
  name: "StakedWalletView",
  components: { StakedWalletRow },
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
