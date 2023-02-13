<template>
  <div id="token-tracker">
    <div id="chart"></div>
  </div>
</template>

<script lang="js">
import { createChart } from "lightweight-charts";
import { mapGetters } from "vuex";
import numberFormat from "../utils/number-format";
import tokenTracker from "../utils/token-tracker";

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
    setLoading: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      updatedChartData: {
        price: {
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        priceXtz: {
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        volume: {
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        volumeXtz: {
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        tvl: {
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        tvlXtz: {
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
      },
    };
  },

  computed: {
    ...mapGetters([
      "getChartData",
      "getXtzUsdPrice",
      "getXtzUsdHistory",
      "getShowUsd",
    ]),
  },
  watch: {
    legendTab() {
      this.getPrices();
    },
    duration() {
      this.getPrices();
    },
    getChartData: function (val) {
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
  },
  mounted() {
    this.sortTokenData();
    this.getPrices();

  },
  methods: {
    sortTokenData() {
      this.setLoading(true);
      this.updatedChartData.tvl.days1 = this.getChartData.tvl1Day.map(
        (element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );
      this.updatedChartData.tvlXtz.days1 = this.getChartData.tvl1Day.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl),
          };
        }
      );

      this.updatedChartData.tvl.days7 = this.getChartData.tvl7Day.map(
        (element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );

      this.updatedChartData.tvlXtz.days7 = this.getChartData.tvl7Day.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl),
          };
        }
      );

      this.updatedChartData.tvl.days30 = this.getChartData.tvl30Day.map(
        (element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );
      this.updatedChartData.tvlXtz.days30 = this.getChartData.tvl30Day.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl),
          };
        }
      );

      this.updatedChartData.tvl.all = this.getChartData.tvlAll.map(
        (element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );
      this.updatedChartData.tvlXtz.all = this.getChartData.tvlAll.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedTvl),
          };
        }
      );

      this.updatedChartData.price.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedClose) * timeUsdValue,
          };
        });

      this.updatedChartData.priceXtz.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedClose),
          };
        });

      this.updatedChartData.volume.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          // console.log(element);
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });

      this.updatedChartData.volumeXtz.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume),
          };
        });

      // this.updatedChartData.price.days7 =
      //   this.getChartData.volumeAndPrice7Day.map((element) => {
      //     const timeUsdValue = tokenTracker.binarySearch(
      //       this.getXtzUsdHistory,
      //       new Date(element.bucket).getTime()
      //     );
      //     return {
      //       time: new Date(element.bucket).getTime(),
      //       value: Number(element.close) * timeUsdValue,
      //     };
      //   });
      this.updatedChartData.volume.days7 =
        this.getChartData.volumeAndPrice7Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });
      this.updatedChartData.volumeXtz.days7 =
        this.getChartData.volumeAndPrice7Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume),
          };
        });

      // this.updatedChartData.price.days30 =
      //   this.getChartData.volumeAndPrice30Day.map((element) => {
      //     const timeUsdValue = tokenTracker.binarySearch(
      //       this.getXtzUsdHistory,
      //       new Date(element.bucket).getTime()
      //     );
      //     return {
      //       time: new Date(element.bucket).getTime(),
      //       value: Number(element.close) * timeUsdValue,
      //     };
      //   });
      this.updatedChartData.volume.days30 =
        this.getChartData.volumeAndPrice30Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });
      this.updatedChartData.volumeXtz.days30 =
        this.getChartData.volumeAndPrice30Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume),
          };
        });

      // this.updatedChartData.price.all = this.getChartData.allVolumeAndPrice.map(
      //   (element) => {
      //     const timeUsdValue = tokenTracker.binarySearch(
      //       this.getXtzUsdHistory,
      //       new Date(element.bucket).getTime()
      //     );
      //     return {
      //       time: new Date(element.bucket).getTime(),
      //       value: Number(element.close) * timeUsdValue,
      //     };
      //   }
      // );

      this.updatedChartData.volumeXtz.all =
        this.getChartData.allVolumeAndPrice.map((element) => {
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume),
          };
        });
      
      this.updatedChartData.volume.all =
        this.getChartData.allVolumeAndPrice.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime(),
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });

      this.setLoading(false);
    },

    async getPrices() {
      try {
        if (this.legendTab === "tvl") {
          this.tokenData =
            this.duration === "1d"
              ? !this.getShowUsd
                ? this.updatedChartData.tvlXtz.days1
                : this.updatedChartData.tvl.days1
              : this.duration === "7d"
              ? !this.getShowUsd
                ? this.updatedChartData.tvlXtz.days7
                : this.updatedChartData.tvl.days7
              : this.duration === "30d"
              ? !this.getShowUsd
                ? this.updatedChartData.tvlXtz.days30
                : this.updatedChartData.tvl.days30
              : this.duration === "all"
              ? this.updatedChartData.tvl.all
              : null;
        }

        if (this.legendTab === "price") {
          this.tokenData =
            this.duration === "1d"
              ? !this.getShowUsd
                ? this.updatedChartData.priceXtz.days1
                : this.updatedChartData.price.days1
              : // : this.duration === "7d"
                // ? this.updatedChartData.price.days7
                // : this.duration === "30d"
                // ? this.updatedChartData.price.days30
                // : this.duration === "all"
                // ? this.updatedChartData.price.all
                null;
        }

        if (this.legendTab === "volume") {
          this.tokenData =
            this.duration === "1d"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.days1
                : this.updatedChartData.volume.days1
              : this.duration === "7d"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.days7
                : this.updatedChartData.volume.days7
              : this.duration === "30d"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.days30
                : this.updatedChartData.volume.days30
              : this.duration === "all"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.all
                : this.updatedChartData.volume.all
              : null;
        }

        const areaSeriesData = this.tokenData;

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
              precision: this.handlePrecision(this.tokenTracked.usdValue)
                .precision,
              minMove: this.handlePrecision(this.tokenTracked.usdValue).minMove,
            },
          });
        }

        areaSeries.setData(areaSeriesData);
        const container = document.getElementById("chart");
        const toolTipWidth = 80;
        const toolTipMargin = 15;
        const toolTipHeight = 80;
        const toolTipHeightSupport = 100;
        // Create and style the tooltip html element
        const toolTip = document.createElement("div");
        toolTip.id = "token-chart-tooltip";
        toolTip.style.background = "white";
        toolTip.style.color = "black";
        toolTip.style.borderColor = "#555CFF";
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
            toolTip.innerHTML = `<div style="color:#555CFF">${
              this.tokenTracked.symbol || this.tokenTracked.name
            }.</div><div style="font-size: 24px; margin: 0px 0px; color: ${"black"}">
            ${this.getShowUsd ? "$" : ""}${
              this.formatNumShorthand(price).value
            }${this.formatNumShorthand(price).suffix}${
              !this.getShowUsd ? "ꜩ" : ""
            }
            </div><div style="color: ${"black"}">
            ${dateStr}
            </div>`;
            const mediaMaxWidth = 990;
            const tokenMetrics = document.getElementById("token-metrics");
            const tokenMetricsMargin = {};
            if(window.innerWidth <= mediaMaxWidth) {
              tokenMetricsMargin.offsetHeight = tokenMetrics.offsetHeight;
              tokenMetricsMargin.offsetWidth = 0;
            } else {
              tokenMetricsMargin.offsetWidth = tokenMetrics.offsetWidth;
              tokenMetricsMargin.offsetHeight = 0;
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
      } catch (error) {
        console.log("ERROR", error);
      }
    },

    formatDate(date) {
      const d = new Date(date);
      const DD = d.toLocaleString("default", { day: "2-digit" });
      const MMM = d.toLocaleString("default", { month: "short" });
      const YY = d.getFullYear().toString().slice(-2);
      return MMM + " " + DD + ", " + YY;
    },

    handlePrecision(value) {
      let precision = 4;
      let minMove = 0.0001;

      if (value < 0.0000000001 && value > 0) {
        precision = 12;
        minMove = 0.00000000001;
      } else if (value < 0.00000001 && value > 0) {
        precision = 10;
        minMove = 0.000000001;
      } else if (value < 0.000001 && value > 0) {
        precision = 8;
        minMove = 0.00000001;
      } else if (value < 0.0001 && value > 0) {
        precision = 6;
        minMove = 0.000001;
      } else if (value < 0.001 && value > 0) {
        precision = 4;
        minMove = 0.0001;
      } else {
        precision = 4;
        minMove = 0.0001;
      }

      return { precision, minMove };
    },

    formatNumShorthand(val) {
      return numberFormat.shorthand(val);
    },
  },
};
</script>

<style>
#token-tracker {
  min-height: 100%;
  min-height: 400px;
}
#token-tracker #chart {
  width: 100%;
  height: 400px;
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
