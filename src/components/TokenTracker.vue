<template>
  <div id="token-tracker">
    <nav-menu></nav-menu>

    <el-main class="page_width">
      <el-row
        :gutter="20"
        type="flex"
        style="margin-bottom: 30px; flex-wrap: wrap; row-gap: 10px"
      >
        <el-col :md="24">
          <el-row
            type="flex"
            justify="space-between"
            style="flex-wrap: wrap; gap: 10px"
          >
            <el-col :xs="24" :span="18" class="grid-content">
              <h2
                style="
                  margin-top: 0;
                  margin-bottom: 5px;
                  font-weight: 700;
                  font-size: 28px;
                  line-height: 42px;
                "
              >
                Tezos Cryptocurrency Prices by Market Cap
              </h2>
              <span
                style="
                  color: var(--color-subheading-text);
                  font-weight: 400;
                  font-size: 16px;
                  line-height: 24px;
                "
                >View charts and price data on cryptocurrencies in the Tezos
                ecosystem</span
              >
            </el-col>
            <el-col class="hide-md" :span="5" style="text-align: right">
              <div style="margin-top: 14px">
                <img
                  style="width: 45%"
                  src="../assets/token-tracker-vector.svg"
                  alt=""
                />
              </div>
            </el-col>
          </el-row>

          <el-row
            type="flex"
            :gutter="20"
            style="margin-top: 24px; flex-wrap: wrap; row-gap: 20px"
          >
            <el-col :sm="12" :md="12">
              <div class="grid-content" style="height: 100%">
                <!-- <el-card class="box-card" shadow="always" style="height: 100%"> -->
                <el-col>
                  <Overview
                    id="mktCap-chart"
                    :key="'mktCap'"
                    :loading="getLoading"
                    :chart-type="'mktCap'"
                  />
                </el-col>
                <!-- </el-card> -->
              </div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="grid-content" style="height: 100%">
                <!-- <el-card class="box-card" shadow="always" style="height: 100%"> -->
                <el-col>
                  <Overview
                    id="vol-chart"
                    :key="'volume'"
                    :loading="getLoading"
                    :chart-type="'volume'"
                  />
                </el-col>
                <!-- </el-card> -->
              </div>
            </el-col>
          </el-row>

          <el-row
            align="middle"
            type="flex"
            justify="space-between"
            style="margin-top: 30px"
            :gutter="10"
          >
            <el-col :xs="12" :span="10">
              <div class="grid-content search-input">
                <el-input
                  :value="tokenTracker.searchInput"
                  placeholder="Search tokens"
                  prefix-icon="fa-solid fa-magnifying-glass"
                  class="el-card is-always-shadow"
                  style="
                    border-radius: 24px !important;
                    border: 0 !important;
                    background: var(--background-card) !important;
                  "
                  @input="updateSearchInput"
                >
                </el-input></div
            ></el-col>
          </el-row>
        </el-col>
      </el-row>
      <div>
        <el-card v-loading="tokenTracker.loading" shadow="always">
          <div class="responsive-table">
            <div>
              <el-row
                type="flex"
                align="middle"
                class="header-row-wrap"
                style="
                  border-bottom: var(--line-border);
                  padding-bottom: 14px;
                  margin-bottom: 14px;
                  min-width: 900px;
                "
              >
                <el-col :span="24">
                  <el-row
                    :gutter="20"
                    type="flex"
                    align="middle"
                    style="padding: 0 20px; color: var(--color-subheading-text)"
                  >
                    <el-col style="text-align: right" :span="1"> </el-col>
                    <el-col :span="23">
                      <el-row>
                        <el-col :span="2">#</el-col>

                        <el-col :span="4">
                          <div
                            class="wrap-sort-icon"
                            @click="toggleColumSort('symbol')"
                          >
                            Token
                            <sort-arrow-indicator
                              v-if="sort.key === 'symbol'"
                              :value="sort.rule"
                              :margin-left="true"
                            />
                          </div>
                        </el-col>

                        <el-col style="text-align: right" :span="4">
                          <div
                            class="wrap-sort-icon"
                            @click="toggleColumSort('cuurentPrice', 'usdValue')"
                          >
                            <sort-arrow-indicator
                              v-if="activeColumn('cuurentPrice', 'usdValue')"
                              :value="sort.rule"
                            />
                            Price
                          </div>
                        </el-col>
                        <el-col style="text-align: right" :span="4">
                          <div
                            class="wrap-sort-icon"
                            @click="toggleColumSort('volume24', 'volume24Usd')"
                          >
                            <sort-arrow-indicator
                              v-if="activeColumn('volume24', 'volume24Usd')"
                              :value="sort.rule"
                            />
                            24 Volume
                          </div>
                        </el-col>
                        <el-col style="text-align: right" :span="4">
                          <div
                            class="wrap-sort-icon"
                            @click="toggleColumSort('mktCap', 'mktCapUsd')"
                          >
                            <sort-arrow-indicator
                              v-if="activeColumn('mktCap', 'mktCapUsd')"
                              :value="sort.rule"
                            />
                            Mkt Cap
                          </div>
                        </el-col>
                        <el-col style="text-align: right" :span="2">
                          <div
                            class="wrap-sort-icon"
                            @click="
                              toggleColumSort('change1Day', 'change1DayUsd')
                            "
                          >
                            <sort-arrow-indicator
                              v-if="activeColumn('change1Day', 'change1DayUsd')"
                              :value="sort.rule"
                            />
                            1d
                            <el-tooltip
                              :content="`% Change in ${
                                getShowUsd ? 'USD' : 'XTZ'
                              }`"
                              placement="top"
                              effect="light"
                            >
                              <i class="fa-regular fa-info-circle"></i>
                            </el-tooltip>
                          </div>
                        </el-col>
                        <el-col style="text-align: right" :span="2">
                          <div
                            class="wrap-sort-icon"
                            @click="
                              toggleColumSort('change7Day', 'change7DayUsd')
                            "
                          >
                            <sort-arrow-indicator
                              v-if="activeColumn('change7Day', 'change7DayUsd')"
                              :value="sort.rule"
                            />
                            7d
                            <el-tooltip
                              :content="`% Change in ${
                                getShowUsd ? 'USD' : 'XTZ'
                              }`"
                              placement="top"
                              effect="light"
                            >
                              <i class="fa-regular fa-info-circle"></i>
                            </el-tooltip>
                          </div>
                        </el-col>
                        <el-col style="text-align: right" :span="2">
                          <div
                            class="wrap-sort-icon"
                            @click="
                              toggleColumSort('change30Day', 'change30DayUsd')
                            "
                          >
                            <sort-arrow-indicator
                              v-if="
                                activeColumn('change30Day', 'change30DayUsd')
                              "
                              :value="sort.rule"
                            />
                            30d
                            <el-tooltip
                              :content="`% Change in ${
                                getShowUsd ? 'USD' : 'XTZ'
                              }`"
                              placement="top"
                              effect="light"
                            >
                              <i class="fa-regular fa-info-circle"></i>
                            </el-tooltip>
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <TokenTrakerRow
                v-for="(token, index) in tabledata"
                :key="index"
                :asset="token"
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
    </el-main>
  </div>
</template>

<script>
import TokenTrakerRow from "./TokenTrakerRow.vue";
import NavMenu from "./NavMenu.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import numberFormat from "../utils/number-format";
import _ from "lodash";
import SortArrowIndicator from "./SortArrowIndicator.vue";
import TablePagination from "./TablePagination.vue";
import Overview from "./Overview.vue";

export default {
  name: "TokenTracker",
  components: {
    TokenTrakerRow,
    NavMenu,
    SortArrowIndicator,
    TablePagination,
    Overview,
  },
  data() {
    return {
      activeTab: "wallet",
      sort: {
        key: "",
        rule: "",
      },
      currentColumns: [],
      tabledata: [],
      showUsd: false,
      currentPage: 0,
      pages: 0,
      nextPage: 1,
      prevPage: 0,
      displayCount: 100,
    };
  },

  computed: {
    ...mapState(["tokenTracker"]),
    ...mapGetters(["getTrackerData", "getTokens", "getShowUsd"]),
    sortedTokensTracked() {
      return (
        _.orderBy(
          this.getTokens,
          ["isFavorite", this.sort.key],
          ["desc", this.sort.rule]
        ) || []
      );
    },
    getLoading() {
      return this.tokenTracker.loading;
    },
  },

  watch: {
    "$store.state.tokenTracker.tokenList": {
      immediate: true,
      deep: true,
      handler() {
        this.paginationHandler();
      },
    },

    sortedTokensTracked(newValue) {
      this.paginationHandler();
    },

    "sort.key": {
      immediate: true,
      deep: true,
      handler() {
        this.paginationHandler();
      },
    },

    "sort.rule": {
      immediate: true,
      deep: true,
      handler() {
        this.paginationHandler();
      },
    },

    getShowUsd(value) {
      if (this.currentColumns[1]) {
        this.key = value ? this.currentColumns[1] : this.currentColumns[0];
      }
    },
  },

  created() {
    this.fetchTokensTracked();
  },

  mounted() {
    setInterval(() => {
      this.softLoadTokensTracked();
    }, 1000 * 60 * 3);
  },

  methods: {
    ...mapActions(["fetchTokensTracked", "softLoadTokensTracked"]),
    fmtNumber(val) {
      return numberFormat.shorthand(val);
    },

    updateSearchInput(input) {
      this.$store.commit("updateTokenTrackerSearchInput", input);
    },

    paginationHandler() {
      this.pages = Math.ceil(
        this.sortedTokensTracked.length / this.displayCount
      );

      this.handleVisibleData();
    },

    handleVisibleData() {
      const next = this.nextPage > this.pages ? this.pages : this.nextPage;
      this.tabledata = this.sortedTokensTracked.slice(
        (next - 1) * this.displayCount,
        this.nextPage * this.displayCount > this.sortedTokensTracked.length
          ? this.sortedTokensTracked.length
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

    toggleColumSort(column, columnUsd) {
      this.currentColumns = [column, columnUsd];
      const key = !columnUsd ? column : this.getShowUsd ? columnUsd : column;
      if (this.sort.key === key) {
        this.sort.rule = this.sort.rule === "asc" ? "desc" : "asc";
      } else {
        this.sort.key = key;
        this.sort.rule = "desc";
      }
    },
    activeColumn(column, columnUsd) {
      const key = !columnUsd ? column : this.getShowUsd ? columnUsd : column;
      return this.sort.key === key;
    },
  },
};
</script>

<style lang="scss">
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

#token-tracker {
  .el-divider--vertical {
    height: 120% !important;
  }

  .el-card.top {
    box-shadow: unset !important;
    padding-left: 20px;
  }

  .divider {
    opacity: 0.26;
  }

  .divider .el-divider.el-divider--horizontal {
    margin: 0 !important;
  }

  .header-row-wrap .wrap-sort-icon {
    color: var(--color-subheading-text);
    font-size: 14px;
    font-weight: 600;
    align-items: center;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    width: 100%;
    height: 100%;

    &:hover {
      color: var(--color-subheading-text);
      transition: 0.2s ease-in-out color;
    }
  }

  input.el-input__inner {
    border-radius: 28px;
    /* background: var(--background-color) !important; */
    color: var(--primary-text) !important;
    border: var(--line-border) !important;
    transition: 0.13s ease border-color;
    &::placeholder {
      color: var(--color-subheading-text) !important;
    }

    &:hover {
      border-color: var(--primary-text) !important;
    }

    &:focus {
      border-color: #555cff !important;
    }
  }

  .el-input__icon {
    color: var(--color-subheading-text) !important;
  }

  .tab-select-element {
    display: none;
    width: 100%;
  }

  .show-md {
    display: none;
  }

  .hide-md {
    display: block;
  }

  @media (max-width: 993px) {
    .show-md {
      display: block;
    }

    .hide-md {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .tab-select-element {
      display: block;
    }

    .tab-custom-element {
      display: none;
    }
  }
}
</style>
