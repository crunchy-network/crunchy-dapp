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
              <el-row
                :gutter="20"
                type="flex"
                align="middle"
                style="padding: 0 20px; color: #757679"
              >
                <el-col :span="5">Market Cap</el-col>
                <el-col :span="5">Total Supply</el-col>
                <el-col :span="5">#</el-col>
                <el-col :span="5">24h Trading Vol</el-col>
                <el-col :span="5">All Time High</el-col>
                <el-col :span="5">All Time Low</el-col>
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
                  :gutter="20"
                  class="farm-row"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="5">
                    {{
                      vueNumberFormat(
                        formatNumShorthand(tokenTracked.mktCap).value,
                        {
                          prefix: "$",
                          suffix: formatNumShorthand(tokenTracked.mktCap)
                            .suffix,
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        }
                      )
                    }}
                  </el-col>
                  <el-col :span="5">
                    {{
                      vueNumberFormat(
                        formatNumShorthand(tokenTracked.calcSupply).value,
                        {
                          prefix: "",
                          suffix: formatNumShorthand(tokenTracked.calcSupply)
                            .suffix,
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        }
                      )
                    }}</el-col
                  >
                  <el-col style="" :span="5">{{ tokenTracked.order }}</el-col>
                  <el-col :span="5">
                    {{
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
                    >
                  </el-col>
                  <el-col :span="5">
                    {{
                      vueNumberFormat(
                        formatNumShorthand(tokenTracked.allTimeHigh).value,
                        {
                          prefix: "$",
                          suffix: formatNumShorthand(tokenTracked.allTimeHigh)
                            .suffix,
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        }
                      )
                    }}<number-tooltip
                      :number="tokenTracked.allTimeHigh"
                    ></number-tooltip>
                  </el-col>
                  <el-col :span="5">
                    {{
                      vueNumberFormat(
                        formatNumShorthand(tokenTracked.allTimeLow).value,
                        {
                          prefix: "$",
                          suffix: formatNumShorthand(tokenTracked.allTimeLow)
                            .suffix,
                          decimal: ".",
                          thousand: ",",
                          precision: 2,
                        }
                      )
                    }}<number-tooltip
                      :number="tokenTracked.allTimeLow"
                    ></number-tooltip>
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
            class="tab-text"
            :style="isActiveTab('1d', duration)"
            @click="setDurationTab('1d')"
          >
            1d
          </button>
          <button
            class="tab-text"
            :style="isActiveTab('7d', duration)"
            @click="setDurationTab('7d')"
          >
            7d
          </button>
          <button
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
          <button
            class="tab-text"
            :style="isActiveTab('price', legendTab)"
            @click="setLegendTab('price')"
          >
            Price
          </button>
        </div>
      </el-row>
      <div ref="chartContainer">
        <TrackerOverviewChart />
      </div>
    </el-card>
  </div>
</template>

<script>
import numberFormat from "../utils/number-format";
import NumberTooltip from "./NumberTooltip.vue";
import TrackerOverviewChart from "./TrackerOverviewChart.vue";

export default {
  components: { TrackerOverviewChart, NumberTooltip },

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
      legendTab: "volume",
    };
  },

  watch: {
    tokenTracked() {
      console.log(this.tokenTracked);
    },
  },

  methods: {
    isActiveTab(tabValue, tab) {
      return tabValue === tab && "color: #FF4D4B; font-weight: 700";
    },

    setLegendTab(tab = "") {
      if (["volume", "tvl", "price"].includes(tab)) {
        this.legendTab = tab;
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