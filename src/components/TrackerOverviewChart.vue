<template>
  <div id="token-tracker">
    <div id="chart"></div>
  </div>
</template>

<script>
import { createChart } from "lightweight-charts";
import { mapGetters } from "vuex";

export default {
  props: {
    tokenTracked: {
      type: Object,
      default: () => {},
    },
    duration: {
      type: String,
      default: "1d",
    },
    legendTab: {
      type: String,
      default: "volume",
    },
  },
  computed: {
    ...mapGetters(["getChartData"]),
  },
  watch: {
    legendTab() {
      this.getPrices();
    },
    duration() {
      this.getPrices();
    },
    getChartData: function (val) {
      this.getPrices();
    },
  },
  mounted() {
    this.getPrices();
  },
  methods: {
    async getPrices() {
      if (this.legendTab === "tvl") {
        this.tokenData =
          this.duration === "1d"
            ? this.getChartData.tvl1Day
            : this.duration === "7d"
            ? this.getChartData.tvl7Day
            : this.duration === "30d"
            ? this.getChartData.tvl30Day
            : this.duration === "all"
            ? this.getChartData.tvlAll
            : null;
      } else {
        this.tokenData =
          this.duration === "1d"
            ? this.getChartData.volumeAndPrice1Day
            : this.duration === "7d"
            ? this.getChartData.volumeAndPrice7Day
            : this.duration === "30d"
            ? this.getChartData.volumeAndPrice30Day
            : this.duration === "all"
            ? this.getChartData.allVolumeAndPrice
            : null;
      }

      const areaSeriesData = this.tokenData.map((element) => {
        return {
          time:
            this.legendTab === "tvl"
              ? Math.floor(new Date(element.timestamp).getTime())
              : Math.floor(new Date(element.bucket).getTime()),
          value:
            this.legendTab === "price"
              ? Number(element.close)
              : this.legendTab === "volume"
              ? Number(element.volume)
              : this.legendTab === "tvl"
              ? Number(element.tvl)
              : null,
        };
      });

      document.getElementById("chart").innerHTML = "";

      var chart = createChart(document.getElementById("chart"), {
        rightPriceScale: {
          visible: true,
          scaleMargins: {
            top: 0.2,
            bottom: 0.2,
          },
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          tickMarkFormatter: (time) => {
            const date = new Date(time);
            return this.formatDate(date);
          },
        },
        grid: {
          vertLines: {
            color: "#f0f3fa",
          },
          horzLines: {
            color: "#f0f3fa",
          },
        },
        crosshair: {
          // hide the horizontal crosshair line
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          // hide the vertical crosshair label
          vertLine: {
            labelVisible: false,
          },
        },
      });

      var areaSeries = chart.addAreaSeries({
        topColor: "rgba(85,92,255,.5)",
        bottomColor: "rgba(85,92,255,.04)",
        lineColor: "rgba(85,92,255,1)",
        lineWidth: 2,
      });

      if (this.legendTab === "price") {
        areaSeries.applyOptions({
          priceFormat: {
            type: "price",
            // precision: 6,
            // minMove: 0.000001,
          },
        });
      }

      areaSeries.setData(areaSeriesData);
      const container = document.getElementById("chart");
      const toolTipWidth = 80;
      const toolTipMargin = 15;
      const toolTipHeightSupport = 250;
      // Create and style the tooltip html element
      const toolTip = document.createElement("div");
      toolTip.id = "token-chart-tooltip";
      toolTip.style.background = "white";
      toolTip.style.color = "black";
      toolTip.style.borderColor = "rgba( 38, 166, 154, 1)";
      container.appendChild(toolTip);
      // update tooltip
      chart.subscribeCrosshairMove((param) => {
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > container.clientWidth ||
          param.point.y < 0 ||
          param.point.y > container.clientHeight
        ) {
          toolTip.style.display = "none";
        } else {
          const dateStr = this.formatDate(param.time);
          toolTip.style.display = "block";
          const price = param.seriesPrices.get(areaSeries);
          toolTip.innerHTML = `<div style="color: ${"rgba( 38, 166, 154, 1)"}">${
            this.tokenTracked.symbol || this.tokenTracked.name
          }.</div><div style="font-size: 24px; margin: 4px 0px; color: ${"black"}">
            $${Number(price).toFixed(this.handlePrecision(price))}
            </div><div style="color: ${"black"}">
            ${dateStr}
            </div>`;
          const y = param.point.y;
          let left = param.point.x + toolTipMargin;
          if (left > container.clientWidth - toolTipWidth) {
            left = param.point.x - toolTipMargin - toolTipWidth;
          }
          const top = y + toolTipMargin + toolTipHeightSupport;
          toolTip.style.left = left + "px";
          toolTip.style.top = top + "px";
        }
      });
    },
    formatDate(date) {
      const d = new Date(date);
      const DD = d.toLocaleString("default", { day: "2-digit" });
      const MMM = d.toLocaleString("default", { month: "short" });
      const YY = d.getFullYear().toString().slice(-2);
      return MMM + " " + DD + ", " + YY;
    },

    handlePrecision(value) {
      let precision = 2;
      if (value < 0.0000000001 && value > 0) {
        precision = 12;
      } else if (value < 0.00000001 && value > 0) {
        precision = 10;
      } else if (value < 0.000001 && value > 0) {
        precision = 8;
      } else if (value < 0.0001 && value > 0) {
        precision = 6;
      } else if (value < 0.001 && value > 0) {
        precision = 4;
      } else {
        precision = 2;
      }

      return precision;
    },
  },
};
</script>

<style>
#token-tracker #chart {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: flex-start;
}

#token-tracker #token-chart-tooltip {
  min-width: 130px;
  max-width: max-content;
  height: 100px;
  position: absolute;
  display: none;
  padding: 8px;
  box-sizing: border-box;
  font-size: 12px;
  text-align: left;
  z-index: 1000;
  top: 12px;
  left: 12px;
  pointer-events: none;
  border: 1px solid;
  border-radius: 4px;
  font-family: "Poppins", Roboto, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
