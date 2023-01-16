<template>
  <div>
    <NavMenu />
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
          Tezos Token Tracker
        </router-link>
        <i
          style="font-size: 12px; color: #c0c4cc; margin: 0 5px"
          class="fa-solid fa-angle-right"
        ></i>
        <span
          disabled
          type="text"
          style="
            font-weight: 600;
            font-size: 16px;
            color: #c0c4cc;
            line-height: 24px;
          "
        >
          {{ getTokenOverview.name || getTokenOverview.symbol }}
        </span>
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
              style="color: #555cff; text-decoration: none; font-weight: 600"
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
                  getTokenOverview.change1Day < 0 ? 'n-change' : 'p-change'
                "
              >
                {{
                  getLoading
                    ? "-"
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

      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        style="flex-wrap: wrap; padding: 10px 0"
        :gutter="10"
      >
        <div class="tab-wrapper tab-custom-element">
          <button
            class="tab-text"
            :style="isActiveTab('overview')"
            @click="setActiveTab('overview')"
          >
            Overview
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('markets')"
            @click="setActiveTab('markets')"
          >
            Markets
          </button>
        </div>
      </el-row>

      <TrackerOverview
        v-if="activeTab === 'overview'"
        :duration="duration"
        :set-duration-tab="setDurationTab"
        :token-tracked="getTokenOverview"
        :loading="getLoading"
      />
      <TrackerMarkets v-if="activeTab === 'markets'" :loading="getLoading" />
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
export default {
  components: {
    NavMenu,
    TrackerOverview,
    TrackerMarkets,
    PriceFormat,
  },
  data() {
    return {
      activeTab: "overview",
      duration: "all",
    };
  },

  computed: {
    ...mapGetters(["getTokenOverview"]),
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
    setInterval(() => {
      this.fetchTokenTrackedWithId({
        id: this.$route.params.tokenId,
        softLoad: true,
      });
    }, 1000 * 60 * 3);
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
  },

  methods: {
    ...mapActions(["fetchTokenTrackedWithId"]),
    refresh() {
      this.fetchTokenTrackedWithId({ id: this.$route.params.tokenId });
    },
    isActiveTab(tab) {
      return (
        this.activeTab === tab &&
        " border-bottom: 3px solid #FF4D4B; color: #FF4D4B; font-weight: 700"
      );
    },

    setActiveTab(tab = "") {
      if (["overview", "markets"].includes(tab)) {
        this.activeTab = tab;
        this.$router.replace({
          query: {
            ...this.$route.query,
            tab,
          },
        });
      }
    },

    setDurationTab(tab = "") {
      if (["1d", "7d", "30d", "all"].includes(tab)) {
        this.duration = tab;
        this.$router.replace({
          query: {
            ...this.$route.query,
            duration: tab,
          },
        });
      }
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
</style>
