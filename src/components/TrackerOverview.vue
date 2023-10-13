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
        align="end"
        justify="end"
      >
        <div class="tab-wrapper tab-custom-element">
          <el-select
            v-if="legendTab === 'price'"
            v-model="duration"
            class="tab-select"
            placeholder="Select"
          >
            <el-option
              v-for="item in durationPriceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-if="legendTab !== 'price'"
            v-model="duration"
            class="tab-select"
            placeholder="Select"
          >
            <el-option
              v-for="item in durationVolumeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="legendTab"
            class="tab-select"
            placeholder="Select"
          >
            <el-option
              v-for="item in legendOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-if="legendTab === 'price'"
            v-model="priceChartType"
            class="tab-select"
            placeholder="Select"
          >
            <el-option
              v-for="item in priceChartOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-row>
      <TrackerOverviewChart
        :token-tracked="tokenTracked"
        :duration="duration"
        :legend-tab="legendTab"
        :set-loading="setChartLoading"
        :price-chart-type="priceChartType"
      />
    </el-card>
  </div>
</template>

<script>
import numberFormat from "../utils/number-format";
import TrackerOverviewChart from "./TrackerOverviewChart.vue";
import { mapGetters } from "vuex";
export default {
  components: { TrackerOverviewChart },

  props: {
    duration: {
      type: String,
      default: "1d",
    },
    setDurationTab: {
      type: Function,
      default: () => {},
    },
    tokenTracked: {
      type: Object,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      legendTab: "price",
      priceChartType: "candles",
      chartLoading: false,
      durationPriceOptions: [
        {
          value: "4h",
          label: "4h",
        },
        {
          value: "1d",
          label: "1d",
        },
        {
          value: "7d",
          label: "7d",
        },
      ],
      durationVolumeOptions: [
        {
          value: "4h",
          label: "4h",
        },
        {
          value: "1d",
          label: "1d",
        },
        {
          value: "7d",
          label: "7d",
        },
        {
          value: "30d",
          label: "30d",
        },
      ],
      legendOptions: [
        {
          value: "price",
          label: "Price",
        },
        {
          value: "volume",
          label: "Volume",
        },
      ],
      priceChartOptions: [
        {
          value: "candles",
          label: "Candles",
        },
        {
          value: "lines",
          label: "Lines",
        },
      ],
    };
  },

  computed: {
    ...mapGetters(["getLoadingChart", "getXtzUsdPrice"]),
  },
  watch: {
    "$router.query.legend": function (val) {
      this.legendTab = val;
      if (val === "price") {
        if (this.$route.query.duration === "4h") {
          this.setDurationTab("4h");
        } else if (this.$route.query.duration === "1d") {
          this.setDurationTab("1d");
        } else {
          this.setDurationTab("7d");
        }
      }
    },

    legendTab(val) {
      if (val === "price") {
        if (this.$route.query.duration === "4h") {
          this.setDurationTab("4h");
        } else if (this.$route.query.duration === "1d") {
          this.setDurationTab("1d");
        } else {
          this.setDurationTab("7d");
        }
      }
    },
  },

  created() {
    if (this.$route.query.legend) {
      this.legendTab = this.$route.query.legend;
    } else {
      this.$router.replace({
        query: {
          ...this.$route.query,
          legend: this.legendTab,
        },
      });
    }

    if (this.legendTab === "price") {
      if (this.$route.query.duration === "4h") {
        this.setDurationTab("4h");
      } else if (this.$route.query.duration === "1d") {
        this.setDurationTab("1d");
      } else {
        this.setDurationTab("7d");
      }
    }
  },

  methods: {
    setChartLoading(val) {
      this.chartLoading = val;
    },

    isActiveTab(tabValue, tab) {
      return (
        tabValue === tab && "color: var(--color-menu-active); font-weight: 700"
      );
    },

    setPriceChartType(tab = "") {
      if (["candles", "lines"].includes(tab)) {
        this.priceChartType = tab;
      }
    },

    setLegendTab(tab = "") {
      if (["volume", "tvl", "price"].includes(tab)) {
        this.legendTab = tab;
      }
      this.$router.replace({
        query: {
          ...this.$route.query,
          legend: tab,
        },
      });
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

.tab-select {
  width: 110px;
}
@media (max-width: 576px) {
  .tab-flex {
    flex-direction: column;
  }
  .tab-custom-element {
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
