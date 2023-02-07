<template>
  <div id="token-tracker">
    <nav-menu></nav-menu>

    <el-main class="page_width">
      <el-row
        :gutter="20"
        type="flex"
        style="margin-bottom: 30px; flex-wrap: wrap; row-gap: 10px"
      >
        <el-col :md="19">
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
                  color: var(--color-subtitle);
                  font-weight: 400;
                  font-size: 16px;
                  line-height: 24px;
                "
                >View charts and price data on cryptocurrencies in the Tezos
                ecosystem</span
              >
            </el-col>
          </el-row>

          <el-row
            type="flex"
            :gutter="20"
            style="margin-top: 24px; flex-wrap: wrap; row-gap: 20px"
          >
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: var(--color-title-light);
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    EST Total Mkt Cap
                  </h2>
                  <div
                    style="
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    <price-format
                      :font-weight="700"
                      :font-size="24"
                      :value="getTrackerData.estimatedMktCap"
                      :usd-value="getTrackerData.estimatedMktCapUsd"
                    />
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: var(--color-title-light);
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    24h Total Vol
                  </h2>
                  <div
                    style="
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    <price-format
                      :font-weight="700"
                      :font-size="24"
                      :value="getTrackerData.total24hVolume"
                      :usd-value="getTrackerData.total24hVolumeUsd"
                    />
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: var(--color-title-light);
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    Tokens Tracked
                  </h2>
                  <h2
                    style="
                      font-weight: 700;
                      font-size: 24px;
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    {{ getTrackerData.tokensTracked }}
                  </h2>
                </el-card>
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="grid-content" style="height: 100%">
                <el-card class="box-card" shadow="always" style="height: 100%">
                  <h2
                    style="
                      color: var(--color-title-light);
                      font-size: 14px;
                      margin: 0;
                    "
                  >
                    DEX’s Tracked
                  </h2>
                  <h2
                    style="
                      font-weight: 700;
                      font-size: 24px;
                      margin-top: 14px;
                      margin-bottom: 5px;
                      margin-top: 4px;
                    "
                  >
                    {{ getTrackerData.dexCovered }}
                  </h2>
                </el-card>
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
                  style="background-color: transparent"
                  @input="updateSearchInput"
                >
                </el-input></div
            ></el-col>
          </el-row>
        </el-col>
        <el-col class="hide-md" :span="5" style="text-align: right">
          <div style="margin-top: 14px">
            <img
              style="width: 80%"
              src="../assets/token-tracker-vector.svg"
              alt=""
            />
          </div>
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
                    style="padding: 0 20px"
                  >
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
                        @click="toggleColumSort('change1Day', 'change1DayUsd')"
                      >
                        <sort-arrow-indicator
                          v-if="activeColumn('change1Day', 'change1DayUsd')"
                          :value="sort.rule"
                        />
                        1d
                        <el-tooltip
                          :content="`% Change in ${getShowUsd ? 'USD' : 'XTZ'}`"
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
                        @click="toggleColumSort('change7Day', 'change7DayUsd')"
                      >
                        <sort-arrow-indicator
                          v-if="activeColumn('change7Day', 'change7DayUsd')"
                          :value="sort.rule"
                        />
                        7d
                        <el-tooltip
                          :content="`% Change in ${getShowUsd ? 'USD' : 'XTZ'}`"
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
                          v-if="activeColumn('change30Day', 'change30DayUsd')"
                          :value="sort.rule"
                        />
                        30d
                        <el-tooltip
                          :content="`% Change in ${getShowUsd ? 'USD' : 'XTZ'}`"
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

              <TokenTrakerRow
                v-for="(token, index) in tabledata"
                :key="index"
                :asset="token"
              />
              <row-pagination
                :current-page="currentPage"
                :handle-end="handleEnd"
                :handle-next-page="handleNextPage"
                :handle-prev-page="handlePrevPage"
                :handle-start="handleStart"
                :next-page="nextPage"
                :pages="pages"
              ></row-pagination>
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
import PriceFormat from "./PriceFormat.vue";
import _ from "lodash";
import SortArrowIndicator from "./SortArrowIndicator.vue";
import RowPagination from "./RowPagination.vue";

export default {
  name: "TokenTracker",
  components: {
    TokenTrakerRow,
    NavMenu,
    PriceFormat,
    SortArrowIndicator,
    RowPagination,
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
      return _.orderBy(this.getTokens, [this.sort.key], [this.sort.rule]) || [];
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

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

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
  color: #757679;
  cursor: pointer;
  transition: 0.3s ease all;
  margin: 0;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  &:disabled {
    color: var(--color-disabled);
    cursor: not-allowed;
  }
}

.divider {
  opacity: 0.26;
}

.divider .el-divider.el-divider--horizontal {
  margin: 0 !important;
}

.header-row-wrap {
  border-bottom: 2px solid var(--color-table-header-border) !important;
}

.header-row-wrap .wrap-sort-icon {
  color: #757679;
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
    color: var(--color-text);
    transition: 0.2s ease-in-out color;
  }
}
.el-input__inner {
  border-radius: 28px;
  /* background: transparent; */
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
</style>
