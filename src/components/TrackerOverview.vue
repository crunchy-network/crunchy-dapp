<template>
  <div>
    <el-card v-loading="loading" shadow="always">
      <div class="responsive-table">
        <div>
          <el-row
            type="flex"
            align="middle"
            style="
              font-size: 14px;
              font-weight: 600;
              padding-bottom: 4px;
              margin-bottom: 4px;
              min-width: 900px;
            "
          >
            <el-col :span="24">
              <el-row align="middle" style="padding: 0 20px; color: #757679">
                <div
                  style="
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                  "
                >
                  <el-col>Market Cap</el-col>
                  <el-col>Total Supply</el-col>
                  <el-col>Market Cap Rank</el-col>
                  <el-col>Total Value Locked</el-col>
                  <el-col>24h Trading Vol</el-col>
                  <el-col>All Time High</el-col>
                  <el-col>All Time Low</el-col>
                </div>
              </el-row>
            </el-col>
          </el-row>
          <el-row
            style="font-size: 14px; font-weight: 600"
            type="flex"
            align="top"
          >
            <el-col :span="24">
              <div class="item-row">
                <el-row
                  class="farm-row"
                  type="flex"
                  align="middle"
                  style="
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 10px;
                  "
                >
                  <el-col>
                    <price-format prefix="$" :value="tokenTracked.mktCap" />
                  </el-col>
                  <el-col>
                    <price-format :value="tokenTracked.calcSupply" />
                  </el-col>
                  <el-col>{{ tokenTracked.order }}</el-col>
                  <el-col>
                    <price-format prefix="$" :value="tokenTracked.tokenTvl" />
                  </el-col>
                  <el-col>
                    <!-- {{
                      vueNumberFormat(
                        formatNumShorthand(tokenTracked.volume1Day).value,
                        {
                          prefix: "$",
                          suffix: formatNumShorthand(tokenTracked.volume1Day)
                            .suffix,
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        }
                      )
                    }}

                    <span
                      style="font-size: 12px"
                      :class="
                        tokenTracked.volume1DayChange < 0
                          ? 'n-change'
                          : 'p-change'
                      "
                      >{{
                        vueNumberFormat(tokenTracked.volume1DayChange, {
                          prefix: "",
                          suffix: "%",
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        })
                      }}</span
                    > -->
                    N/A
                  </el-col>
                  <el-col>
                    <price-format
                      prefix="$"
                      :value="tokenTracked.allTimeHigh"
                    />
                  </el-col>
                  <el-col>
                    <price-format prefix="$" :value="tokenTracked.allTimeLow" />
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card v-loading="loading" style="margin-top: 24px" shadow="always">
      <el-row
        class="tab-flex"
        :gutter="10"
        type="flex"
        align="start"
        justify="space-between"
      >
        <div class="tab-wrapper tab-custom-element">
          <button
            v-if="legendTab !== 'price'"
            class="tab-text"
            :style="isActiveTab('all', duration)"
            @click="setDurationTab('all')"
          >
            All
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('1d', duration)"
            @click="setDurationTab('1d')"
          >
            1d
          </button>
          <button
            v-if="legendTab !== 'price'"
            class="tab-text"
            :style="isActiveTab('7d', duration)"
            @click="setDurationTab('7d')"
          >
            7d
          </button>
          <button
            v-if="legendTab !== 'price'"
            class="tab-text"
            :style="isActiveTab('30d', duration)"
            @click="setDurationTab('30d')"
          >
            30d
          </button>
        </div>
        <div class="tab-wrapper tab-custom-element">
          <button
            class="tab-text"
            :style="isActiveTab('price', legendTab)"
            @click="setLegendTab('price')"
          >
            Price
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('volume', legendTab)"
            @click="setLegendTab('volume')"
          >
            Volume
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('tvl', legendTab)"
            @click="setLegendTab('tvl')"
          >
            TVL
          </button>
        </div>
      </el-row>
      <div ref="chartContainer">
        <TrackerOverviewChart
          :token-tracked="tokenTracked"
          :duration="duration"
          :legend-tab="legendTab"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import numberFormat from "../utils/number-format";
import TrackerOverviewChart from "./TrackerOverviewChart.vue";
import { mapGetters } from "vuex";
import PriceFormat from "./PriceFormat.vue";
export default {
  components: { TrackerOverviewChart, PriceFormat },

  props: {
    duration: {
      type: String,
      default: "all",
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
    };
  },

  computed: {
    ...mapGetters(["getLoadingChart"]),
  },
  watch: {
    tokenTracked() {
      console.log(this.tokenTracked);
    },

    "$router.query.legend": function (val) {
      this.legendTab = val;
      if (val === "price") {
        if (this.$route.query.duration !== "1d") {
          this.setDurationTab("1d");
        }
      }
    },

    legendTab(val) {
      if (val === "price") {
        if (this.$route.query.duration !== "1d") {
          this.setDurationTab("1d");
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
      if (this.$route.query.duration !== "1d") {
        this.setDurationTab("1d");
      }
    }
  },

  methods: {
    isActiveTab(tabValue, tab) {
      return tabValue === tab && "color: #FF4D4B; font-weight: 700";
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
  color: #757679;
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
