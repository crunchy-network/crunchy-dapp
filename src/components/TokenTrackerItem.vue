<template>
  <div>
    <NavMenu />
    <Banner
      v-if="banner[getTokenOverview.symbol] !== undefined"
      :banner="banner[getTokenOverview.symbol]"
    />
    <!-- class="hidden-sm-and-down" -->
    <el-main class="page_width">
      <el-row type="flex" align="middle">
        <router-link
          tag="a"
          class="link-text"
          :to="{ name: 'home' }"
          type="text"
          style="
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            color: #555cff;
            text-decoration: none;
          "
        >
          <el-button
            round
            type="primary"
            plain
            style="
              background: var(--wallet-background) !important;
              border: 0.5px solid #555cff;
              color: var(--alt-btn-color) !important; ;
            "
            icon="fa-sharp fa-solid fa-arrow-left"
            >{{ " " }}BACK
          </el-button>
        </router-link>
      </el-row>

      <el-row
        type="flex"
        align="middle"
        justify="space-between"
        :gutter="10"
        style="margin-top: 24px"
      >
        <div>
          <el-row type="flex" style="align-items: end">
            <el-avatar
              :src="getTokenOverview.thumbnailUri"
              fit="cover"
              shape="circle"
              :size="40"
              style="
                position: relative;
                border: 1px solid #fff;
                vertical-align: middle;
                margin-right: 10px;
              "
            ></el-avatar>
            <a
              style="
                color: var(--primary-text);
                text-decoration: none;
                font-weight: 600;
                font-size: 20px;
              "
              target="_blank"
            >
              {{ getTokenOverview.name || getTokenOverview.symbol }} (${{
                getTokenOverview.symbol
              }})
            </a>
          </el-row>

          <div style="margin: 18px 0 30px">
            <price-format
              v-if="!getLoading"
              prefix="$"
              :precision="4"
              :font-size="40"
              :line-height="'19px'"
              :value="getTokenOverview.currentPrice"
              :usd-value="getTokenOverview.usdValue"
            >
              <span
                style="font-weight: 600; font-size: 24px"
                :class="
                  handleChangeclass(
                    getTokenOverview,
                    'change1Day',
                    'change1DayUsd'
                  )
                "
              >
                {{
                  getTokenOverview.contract === "tez"
                    ? "-"
                    : getShowUsd
                    ? vueNumberFormat(getTokenOverview.change1DayUsd, {
                        prefix: "",
                        suffix: "%",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                    : vueNumberFormat(getTokenOverview.change1Day, {
                        prefix: "",
                        suffix: "%",
                        decimal: ".",
                        thousand: ",",
                        precision: 2,
                      })
                }}
              </span>
            </price-format>
          </div>
        </div>

        <div>
          <router-link :to="`/swap?from=tez&to=${getTokenOverview.id}`">
            <el-button round type="primary"> Swap </el-button>
          </router-link>
        </div>
      </el-row>

      <div>
        <el-row type="flex" style="flex-wrap: wrap; row-gap: 24px" :gutter="24">
          <el-col :md="8">
            <token-metrics />
          </el-col>
          <el-col :md="16">
            <TrackerOverview
              :duration="duration"
              :set-duration-tab="setDurationTab"
              :token-tracked="getTokenOverview"
              :loading="getLoading"
          /></el-col>
        </el-row>
        <el-col style="margin-top: 24px" :span="24">
          <TrackerMarkets :loading="getLoading" />
        </el-col>
      </div>
    </el-main>
  </div>
</template>

<script>
import NavMenu from "./NavMenu.vue";
import TrackerOverview from "./TrackerOverview.vue";
import TrackerMarkets from "./TrackerMarkets.vue";
import { mapActions, mapGetters, mapState } from "vuex";
import numberFormat from "../utils/number-format";
import PriceFormat from "./PriceFormat.vue";
import TokenMetrics from "./TokenMetrics.vue";
import Banner from "./Banner";

export default {
  components: {
    NavMenu,
    TrackerOverview,
    TrackerMarkets,
    PriceFormat,
    TokenMetrics,
    Banner,
  },
  data() {
    return {
      duration: "all",
      banner: {
        PLENTY: {
          symbol: "PLENTY",
          announcement:
            "PLENTY tokens are being migrated to the PLY token on Plenty Network. Details can be found",
          link: "https://app.plenty.network/migrate",
        },
        WRAP: {
          symbol: "WRAP",
          announcement:
            " WRAP tokens are being migrated to the PLY token on Plenty Network. Details can be found",
          link: "https://app.plenty.network/migrate",
        },
      },
    };
  },

  computed: {
    ...mapGetters(["getTokenOverview", "getShowUsd"]),
    ...mapState(["tokenTracker"]),
    getLoading() {
      return this.tokenTracker.loading;
    },
  },

  watch: {
    "$router.query.tab": function (val) {
      this.activeTab = val;
    },
    "$router.query.duration": function (val) {
      this.activeTab = val;
    },
  },

  created() {
    // setInterval(() => {
    //   this.fetchTokenTrackedWithId({
    //     id: this.$route.params.tokenId,
    //     softLoad: true,
    //   });
    // }, 1000 * 60 * 3);
    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    } else {
      this.$router.replace({
        query: {
          ...this.$route.query,
          tab: this.activeTab,
        },
      });
    }
    if (this.$route.query.duration) {
      this.duration = this.$route.query.duration;
    } else {
      this.$router.replace({
        query: {
          ...this.$route.query,
          duration: this.duration,
        },
      });
    }
  },

  mounted() {
    this.refresh();
    window.scrollTo(0, 0);
  },

  methods: {
    ...mapActions(["fetchTokenTrackedWithId"]),
    refresh() {
      this.fetchTokenTrackedWithId({ id: this.$route.params.tokenId });
    },

    setDurationTab(tab = "") {
      if (["1h", "1d", "7d", "30d", "all"].includes(tab)) {
        this.duration = tab;
        this.$router.replace({
          query: {
            ...this.$route.query,
            duration: tab,
          },
        });
      }
    },

    handleChangeclass(asset, param, usdParam) {
      let className = "";
      if (this.getShowUsd) {
        className = asset[usdParam] < 0 ? "n-change" : "p-change";
      } else {
        className = asset[param] < 0 ? "n-change" : "p-change";
      }

      return className;
    },

    formatNumShorthand(val) {
      return numberFormat.shorthand(val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../crunchy-variables.scss";
@import "~element-ui/packages/theme-chalk/src/common/var";

.n-change {
  color: $--color-danger;
}

.p-change {
  color: $--color-success;
}
.tab-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  button:first-child {
    padding-left: 0;
  }
  button:last-child {
    padding-right: 0;
  }
}

.tab-text {
  min-width: 100px;
  text-align: center;
  padding: 2px 10px;
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
  border-bottom: 3px solid rgba(117, 118, 121, 0.1);
  background: transparent;
  &:disabled {
    color: #191b1f66;
    cursor: not-allowed;
  }
}
@media (max-width: 993px) {
  .token-header {
    font-size: 14px !important;
  }
}
</style>
