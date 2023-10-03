<template>
  <div style="height: 100%">
    <el-card
      v-loading="!loading && !getLoadingChart ? false : true"
      style="height: 100%"
      shadow="always"
    >
      <el-row
        class="tab-flex"
        :gutter="10"
        type="flex"
        align="start"
        justify="space-between"
      >
        <div class="tab-wrapper tab-custom-element">
          <el-row>
            <h2
              style="
                color: var(--color-subheading-text);
                font-size: 14px;
                margin: 0;
              "
            >
              {{ chartType === "mktCap" ? "Total Mkt Cap" : "24h Total Vol" }}
            </h2>
            <div style="margin-top: 14px; margin-bottom: 5px; margin-top: 4px">
              <price-format
                :font-weight="700"
                :font-size="24"
                :value="
                  chartType === 'mktCap'
                    ? getTrackerData.estimatedMktCap
                    : getTrackerData.total24hVolume
                "
                :usd-value="
                  chartType === 'mktCap'
                    ? getTrackerData.estimatedMktCapUsd
                    : getTrackerData.total24hVolumeUsd
                "
              />
            </div>
          </el-row>
        </div>
        <div class="tab-wrapper tab-custom-element">
          <button
            class="tab-text"
            :style="isActiveTab('D', legendTab)"
            @click="setLegendTab('D', chartType)"
          >
            D
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('W', legendTab)"
            @click="setLegendTab('W', chartType)"
          >
            W
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('M', legendTab)"
            @click="setLegendTab('M', chartType)"
          >
            M
          </button>
        </div>
      </el-row>
      <OverviewChart
        :chart-type="chartType"
        :legend-tab="legendTab"
        :set-loading="setChartLoading"
      />
    </el-card>
  </div>
</template>

<script>
import numberFormat from "../utils/number-format";
import OverviewChart from "./OverviewChart.vue";
import PriceFormat from "./PriceFormat.vue";
import { mapGetters } from "vuex";
export default {
  components: { OverviewChart, PriceFormat },

  props: {
    chartType: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      legendTab: "D",
      chartLoading: false,
    };
  },

  computed: {
    ...mapGetters(["getLoadingChart", "getTrackerData"]),
  },
  watch: {
    // "$route.query.legend": function (val) {
    //   // Ensure that this watch only applies to the specific instance of the component
    //   if (this.chartType === this.$route.query.chartType) {
    //     this.legendTab = val;
    //   }
    // },
  },

  // created() {
  //   if (
  //     this.$route.query.legend &&
  //     this.chartType === this.$route.query.chartType
  //   ) {
  //     this.legendTab = this.$route.query.legend;
  //   } else {
  //     this.$router.replace({
  //       query: {
  //         ...this.$route.query,
  //         chartType: this.chartType,
  //         legend: this.legendTab,
  //       },
  //     });
  //   }
  // },

  methods: {
    setChartLoading(val) {
      this.chartLoading = val;
    },

    isActiveTab(tabValue, tab) {
      return (
        tabValue === tab && "color: var(--color-menu-active); font-weight: 700"
      );
    },

    setLegendTab(tab = "") {
      if (["D", "W", "M"].includes(tab)) {
        this.legendTab = tab;
      }
      // this.$router.replace({
      //   query: {
      //     ...this.$route.query,s
      //     chartType: this.chartType,
      //     legend: tab,
      //   },
      // });
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

.tab-wrapper {
  display: flex;
  align-items: flex-start;
}

.tab-text {
  text-align: center;
  padding: 2px 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
  color: var(--color-subheading-text);
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

@media (max-width: 576px) {
  .tab-flex {
    flex-direction: column;
  }
  .tab-custom-element {
    display: flex !important;
    margin-bottom: 0px;
  }
}
.n-change {
  color: $--color-danger;
}

.p-change {
  color: $--color-success;
}
</style>
