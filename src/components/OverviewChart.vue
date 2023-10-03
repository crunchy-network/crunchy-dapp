<template>
  <div class="overview-chart">
    <div :id="chartType"></div>
  </div>
</template>

<script lang="js">
import { createChart } from "lightweight-charts";
import { mapGetters } from "vuex";
import tokenTracker from "../utils/token-tracker";

export default {
  props: {
    chartType: {
      type: String,
      default: "",
    },
    legendTab: {
      type: String,
      default: "D",
    },
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      updatedChartData: {
        mktCap: {
          days1: [],
          days7: [],
          days30: [],
        },
        mktCapXtz: {
          days1: [],
          days7: [],
          days30: [],
        },
        volume: {
          days1: [],
          days7: [],
          days30: [],
        },
        volumeXtz: {
          days1: [],
          days7: [],
          days30: [],
        },
      },
    };
  },

  computed: {
    ...mapGetters([
      "getOverviewChart",
      "getTrackerData",
      "getXtzUsdPrice",
      "getXtzUsdHistory",
      "getShowUsd",
      "getTheme"
    ]),
  },
  watch: {
    legendTab() {
      this.getPrices();
    },
    duration() {
      this.getPrices();
    },
    getOverviewChart: function (val) {
      this.sortTokenData();
      this.getPrices();
    },
    updatedChartData() {
      this.getPrices();
    },
    getXtzUsdHistory() {
      this.getPrices();
    },
    getShowUsd() {
      this.getPrices();
    },
    getTheme() {
      this.getPrices();
    },
  },
  mounted() {
    this.getPrices()

  },
  methods: {
    async sortTokenData() {
      this.updatedChartData.mktCap.days1 =
        this.getOverviewChart.mktCapAndVol1D.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.mktCap) * timeUsdValue,
          };
        });

      this.updatedChartData.mktCapXtz.days1 =
        this.getOverviewChart.mktCapAndVol1D.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.mktCap),
          };
        });

      this.updatedChartData.mktCap.days7 =
        this.getOverviewChart.mktCapAndVol1W.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.mktCap) * timeUsdValue,
          };
        });

      this.updatedChartData.mktCapXtz.days7 =
        this.getOverviewChart.mktCapAndVol1W.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.mktCap),
          };
        });
      
      this.updatedChartData.mktCap.days30 =
        this.getOverviewChart.mktCapAndVol1Mo.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.mktCap) * timeUsdValue,
          };
        });

      this.updatedChartData.mktCapXtz.days30 =
        this.getOverviewChart.mktCapAndVol1Mo.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.mktCap),
          };
        });


      this.updatedChartData.volume.days1 =
        this.getOverviewChart.mktCapAndVol1D.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.totalVol) * timeUsdValue,
          };
        });

      this.updatedChartData.volumeXtz.days1 =
        this.getOverviewChart.mktCapAndVol1D.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.totalVol),
          };
        });
      
      this.updatedChartData.volume.days7 =
        this.getOverviewChart.mktCapAndVol1W.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.totalVol) * timeUsdValue,
          };
        });

      this.updatedChartData.volumeXtz.days7 =
        this.getOverviewChart.mktCapAndVol1W.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.totalVol),
          };
        });
      
      this.updatedChartData.volume.days30 =
        this.getOverviewChart.mktCapAndVol1Mo.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.totalVol) * timeUsdValue,
          };
        });

      this.updatedChartData.volumeXtz.days30 =
        this.getOverviewChart.mktCapAndVol1Mo.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.totalVol),
          };
        });


    },

    async getPrices() {
    this.setLoading(true);
      try {
        await this.sortTokenData();

        if (this.chartType === "mktCap") {
          this.tokenData =
            this.legendTab === "D"
              ? !this.getShowUsd
                ? this.updatedChartData.mktCapXtz.days1
                : this.updatedChartData.mktCap.days1
              : this.legendTab === "W"
              ? !this.getShowUsd
                ? this.updatedChartData.mktCapXtz.days7
                : this.updatedChartData.mktCap.days7
              : this.legendTab === "M"
              ? !this.getShowUsd
                ? this.updatedChartData.mktCapXtz.days30
                : this.updatedChartData.mktCap.days30
              : null;
        }


        if (this.chartType === "volume") {
          this.tokenData =
            this.legendTab === "D"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.days1
                : this.updatedChartData.volume.days1
              : this.legendTab === "W"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.days7
                : this.updatedChartData.volume.days7
              : this.legendTab === "M"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.days30
                : this.updatedChartData.volume.days30
              : null;
        }

        const areaSeriesData = this.tokenData;

        var areaSeries;
        var container;
        var chart;

        if (this.chartType === "mktCap") {
          document.getElementById("mktCap").innerHTML = "";
          chart = createChart(document.getElementById("mktCap"), {
            layout:{
              background:{
                // type: "solid",
                color: this.getTheme === "dark" ? "#191B1F" : "#fff",
              },
              textColor: this.getTheme === "dark" ? "#fff" : "#191B1F",
            },
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
            },
            grid: {
              vertLines: {
                color: this.getTheme === 'dark'? "rgba(240,243,250,0)": "#f0f3fa",
              },
              horzLines: {
                color: this.getTheme === 'dark' ? "rgba(255,255,255,.1)" : "#f0f3fa",
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
            container = document.getElementById("mktCap");
            areaSeries = chart.addAreaSeries({
            topColor: "rgba(85,92,255,.5)",
            bottomColor: "rgba(85,92,255,.04)",
            lineColor: "rgba(85,92,255,1)",
            lineWidth: 2,
          });
        } else {
          document.getElementById("volume").innerHTML = "";
          chart = createChart(document.getElementById("volume"), {
            layout:{
              background:{
                // type: "solid",
                color: this.getTheme === "dark" ? "#191B1F" : "#fff",
              },
              textColor: this.getTheme === "dark" ? "#fff" : "#191B1F",
            },
            rightPriceScale: {
              visible: true,
              scaleMargins: {
                top: 0.2,
                bottom: 0.05,
              },
              borderVisible: false,
            },
            timeScale: {
              borderVisible: false,
            },
            grid: {
              vertLines: {
                color: this.getTheme === 'dark'? "rgba(240,243,250,0)": "#f0f3fa",
              },
              horzLines: {
                color: this.getTheme === 'dark' ? "rgba(255,255,255,.1)" : "#f0f3fa",
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
          container = document.getElementById("volume");
          areaSeries = chart.addHistogramSeries({
            color: "rgba(85,92,255,.5)",
            // downColor: "rgba(85,92,255,.04)",
            lineColor: "rgba(85,92,255,1)",
            lineWidth: 2,
          });
        }

        areaSeries.applyOptions({
            priceFormat: {
              type: "custom",
              formatter: (price) => {
                const precision = this.handlePrecision(price).precision
                const formattedPrice = this.formatNumShorthand(price, precision);
                return formattedPrice.value + formattedPrice.suffix;
              },
            },
          });
        areaSeries.setData(areaSeriesData);

        const toolTipWidth = 80;
        const toolTipMargin = 15;
        const toolTipHeight = 80;
        const toolTipHeightSupport = 100;
        // Create and style the tooltip html element
        const toolTip = document.createElement("div");
        toolTip.id = "token-chart-tooltip";
        toolTip.style.background = "white";
        toolTip.style.color = "black";
        toolTip.style.borderColor = "var(--color-primary)";
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
            const price = Number(param.seriesPrices.get(areaSeries)).toFixed(
              this.handlePrecision(param.seriesPrices.get(areaSeries)).precision
            );
            const precision = this.handlePrecision(price).precision
           
            const mediaMaxWidth = 990;
            const tokenMetricsMargin = {};
            if(this.chartType === "mktCap") {
                tokenMetricsMargin.offsetWidth = 0;
                tokenMetricsMargin.offsetHeight = 0;
                 toolTip.innerHTML = `<div style="color:var(--color-primary)">${
              "Market Cap"
            }.</div><div style="font-size: 24px; margin: 0px 0px; color: ${"black"}">
            ${this.getShowUsd ? "$" : ""}${
              this.formatNumShorthand(price, precision).value
            }${this.formatNumShorthand(price, precision).suffix}${
              !this.getShowUsd ? "ꜩ" : ""
            }
            </div><div style="color: ${"black"}">
            ${dateStr}
            </div>`;
            } else {
               toolTip.innerHTML = `<div style="color:var(--color-primary)">${
              "Total Volume"
            }.</div><div style="font-size: 24px; margin: 0px 0px; color: ${"black"}">
            ${this.getShowUsd ? "$" : ""}${
              this.formatNumShorthand(price, precision).value
            }${this.formatNumShorthand(price, precision).suffix}${
              !this.getShowUsd ? "ꜩ" : ""
            }
            </div><div style="color: ${"black"}">
            ${dateStr}
            </div>`;
              const tokenMetrics = document.getElementById("mktCap-chart");
              if(window.innerWidth <= mediaMaxWidth) {
                tokenMetricsMargin.offsetHeight = tokenMetrics.offsetHeight;
                tokenMetricsMargin.offsetWidth = 0;
              } else {
                tokenMetricsMargin.offsetWidth = tokenMetrics.offsetWidth;
                tokenMetricsMargin.offsetHeight = 0;
                }
              }

            const y = param.point.y;
            let left = param.point.x + toolTipMargin + tokenMetricsMargin.offsetWidth;
            if (left > container.clientWidth - toolTipWidth) {
              left = param.point.x + tokenMetricsMargin.offsetWidth - toolTipMargin - toolTipWidth;
            }
            let top = y + toolTipMargin + toolTipHeightSupport + tokenMetricsMargin.offsetHeight;
            if (top > container.clientHeight - toolTipHeight) {
              top = y + tokenMetricsMargin.offsetHeight - toolTipHeight - toolTipMargin;
            }
            toolTip.style.left = left + "px";
            toolTip.style.top = top + "px";
          }
        });

        // auto expand to fill the chart
        chart.timeScale().fitContent();
      } catch (error) {
        console.log("ERROR", error);
      }
      finally{
        setTimeout(() => {
          this.setLoading(false);
        }, 1000);
      }
    },

    formatDate(date) {
      const d = new Date(date * 1000);
      const DD = d.toLocaleString("default", { day: "2-digit" });
      const MMM = d.toLocaleString("default", { month: "short" });
      const YY = d.getFullYear().toString().slice(-2);
      const hh = d.getHours().toString().padStart(2, '0');
      const mm = d.getMinutes().toString().padStart(2, '0');
      const timeString = `${hh}:${mm}`;
      return timeString + " " + MMM + " " + DD + ", " + YY ;
    },

    handlePrecision(value) {
      let precision = 5;
      let minMove = 0.00001;

      if (value >= 1) {
        precision = 2;
        minMove = 0.01;
      } else if (value >= 0.01) {
        precision = 4;
        minMove = 0.0001;
      } else if (value < 0.0000000001 && value > 0) {
        precision = 12;
        minMove = 0.00000000001;
      } else if (value < 0.00000001 && value > 0) {
        precision = 11;
        minMove = 0.000000001;
      } else if (value < 0.000001 && value > 0) {
        precision = 10;
        minMove = 0.00000001;
      } else if (value < 0.0001 && value > 0) {
        precision = 6;
        minMove = 0.000001;
      } else if (value < 0.001 && value > 0) {
        precision = 5;
        minMove = 0.00001;
      } else {
        precision = 5;
        minMove = 0.00001;
      }

      return { precision, minMove };
    },

    formatNumShorthand(value, precision) {
      const number = precision
        ? parseFloat(value).toFixed(precision)
        : Number(value);
      if (isNaN(number)) return { value: 0, suffix: "" };
      if (number < 1000) {
        return { value: number, suffix: "" };
      } else if (number < 1000000) {
        const value = number / 1000;
        const precisedValue = parseFloat(value).toFixed(precision)
        return { value: precisedValue, suffix: "K" };
      } else if (number < 1000000000) {
        const value = (number / 1000000).toFixed(precision);
        return { value, suffix: "M" };
      } else if (number < 1000000000000) {
        const value = number / 1000000000;
        const precisedValue = parseFloat(value).toFixed(precision)
        return { value: precisedValue, suffix: "B" };
      } else {
        const value = number / 1000000000000;
        const precisedValue = parseFloat(value).toFixed(precision)
        return { value: precisedValue, suffix: "T" };
      }
    },
  },
};
</script>

<style>
.overview-chart {
  min-height: 100%;
  min-height: 300px;
}
.overview-chart #mktCap {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: flex-start;
}
.overview-chart #volume {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: flex-start;
}

.overview-chart #token-chart-tooltip {
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
@media (max-width: 576px) {
  .overview-chart #volume
    > div.tv-lightweight-charts
    > table
    > tr:nth-child(1)
    > td:nth-child(2)
    > div {
    width: 200px !important;
  }
  .overview-chart #volume > div.tv-lightweight-charts > table > tr:nth-child(1) > td:nth-child(2) > div > canvas:nth-child(1){
    width: 200px !important;
  }
  .overview-chart #volume > div.tv-lightweight-charts > table > tr:nth-child(1) > td:nth-child(2) > div > canvas:nth-child(2) {
    width: 200px !important;
  } 
}
</style>
