<template>
  <div>
    <el-card v-loading="homeWallet.loading">
      <div class="responsive-table">
        <div>
          <el-row type="flex" align="middle" class="_table-header">
            <el-col :span="24">
              <el-row
                :gutter="20"
                type="flex"
                align="middle"
                style="padding: 0 20px"
              >
                <el-col :span="4">Asset</el-col>
                <el-col style="text-align: right" :span="4">Balance</el-col>
                <el-col style="text-align: right" :span="4">Price</el-col>
                <el-col style="text-align: right" :span="3">Value</el-col>
                <el-col style="text-align: right" :span="3"
                  >1d
                  <el-tooltip
                    content="% Change in XTZ"
                    placement="top"
                    effect="light"
                  >
                    <i class="fa-regular fa-info-circle"></i>
                  </el-tooltip>
                </el-col>
                <el-col style="text-align: right" :span="3"
                  >7d
                  <el-tooltip
                    content="% Change in XTZ"
                    placement="top"
                    effect="light"
                  >
                    <i class="fa-regular fa-info-circle"></i>
                  </el-tooltip>
                </el-col>
                <el-col style="text-align: right" :span="3"
                  >30d
                  <el-tooltip
                    content="% Change in XTZ"
                    placement="top"
                    effect="light"
                  >
                    <i class="fa-regular fa-info-circle"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <MultisigTokenRow
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
import { mapState, mapActions, mapGetters } from "vuex";
import MultisigTokenRow from "./MultisigTokenRow.vue";

export default {
  name: "HomeWallet",
  components: {  MultisigTokenRow },
  data() {
    return {
      activeTab: "portfolio",
      tabledata: [],
      showUsd: true,
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      displayCount: 5,
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
  @media (max-width: 768px) {
    padding: 0 0 0 0px;
  }
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

.divider .el-divider.el-divider--horizontal {
  margin: 0 !important;
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
</style>
