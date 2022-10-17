<template>
  <div>
    <el-card shadow="always">
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
                <el-col :span="3">#</el-col>
                <el-col :span="5">24h Trading Vol</el-col>
                <el-col :span="3">All Time High</el-col>
                <el-col :span="3">All Time Low</el-col>
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
                  <el-col :span="5">$230.1M</el-col>
                  <el-col :span="5">20.2M</el-col>
                  <el-col style="" :span="3">31</el-col>
                  <el-col :span="5"
                    >$200k
                    <span style="font-size: 12px; color: #1ec37f"
                      >+1.13%</span
                    ></el-col
                  >
                  <el-col :span="3">$12.32</el-col>
                  <el-col :span="3">$2.12</el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 24px" shadow="always">
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
import TrackerOverviewChart from "./TrackerOverviewChart.vue";
export default {
  components: { TrackerOverviewChart },
  data() {
    return {
      duration: "1d",
      legendTab: "volume",
    };
  },
  methods: {
    isActiveTab(tabValue, tab) {
      return tabValue === tab && "color: #FF4D4B; font-weight: 700";
    },
    setDurationTab(tab = "") {
      if (["1d", "7d", "30d"].includes(tab)) {
        this.duration = tab;
      }
    },
    setLegendTab(tab = "") {
      if (["volume", "tvl", "price"].includes(tab)) {
        this.legendTab = tab;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
