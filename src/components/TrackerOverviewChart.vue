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
      default: "price",
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
          hours1: [],
          hours4: [],
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        priceXtz: {
          hours1: [],
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        volume: {
          hours1: [],
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        volumeXtz: {
          hours1: [],
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        tvl: {
          hours1: [],
          days1: [],
          days7: [],
          days30: [],
          all: [],
        },
        tvlXtz: {
          hours1: [],
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
    getTheme() {
      this.getPrices();
    },
  },
  mounted() {
    this.getPrices()

  },
  methods: {
    async sortTokenData() {
      this.updatedChartData.tvl.days1 = this.getChartData.tvl1Day.map(
        (element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );
      this.updatedChartData.tvlXtz.days1 = this.getChartData.tvl1Day.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
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
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );

      this.updatedChartData.tvlXtz.days7 = this.getChartData.tvl7Day.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
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
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );
      this.updatedChartData.tvlXtz.days30 = this.getChartData.tvl30Day.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
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
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedTvl) * timeUsdValue,
          };
        }
      );
      this.updatedChartData.tvlXtz.all = this.getChartData.tvlAll.map(
        (element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedTvl),
          };
        }
      );

      this.updatedChartData.price.hours1 =
        this.getChartData.volumeAndPrice1Hour.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose) * timeUsdValue,
            open: Number(element.aggregatedOpen) * timeUsdValue,
            high: Number(element.aggregatedHigh) * timeUsdValue,
            low: Number(element.aggregatedLow) * timeUsdValue,
          };
        });

      this.updatedChartData.price.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose) * timeUsdValue,
            open: Number(element.aggregatedOpen) * timeUsdValue,
            high: Number(element.aggregatedHigh) * timeUsdValue,
            low: Number(element.aggregatedLow) * timeUsdValue,
          };
        });

      this.updatedChartData.priceXtz.hours1 =
        this.getChartData.volumeAndPrice1Hour.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose),
            open: Number(element.aggregatedOpen),
            high: Number(element.aggregatedHigh),
            low: Number(element.aggregatedLow),
          };
        });

      this.updatedChartData.priceXtz.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose),
            open: Number(element.aggregatedOpen),
            high: Number(element.aggregatedHigh),
            low: Number(element.aggregatedLow),
          };
        });

      this.updatedChartData.price.hours4 =
        this.getChartData.volumeAndPrice4Hour.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose) * timeUsdValue,
            open: Number(element.aggregatedOpen) * timeUsdValue,
            high: Number(element.aggregatedHigh) * timeUsdValue,
            low: Number(element.aggregatedLow) * timeUsdValue,
          };
      });

      this.updatedChartData.priceXtz.hours4 =
        this.getChartData.volumeAndPrice4Hour.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose),
            open: Number(element.aggregatedOpen),
            high: Number(element.aggregatedHigh),
            low: Number(element.aggregatedLow),
          };
        });


      this.updatedChartData.price.days7 =
        this.getChartData.volumeAndPrice7Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime() + 1000 * 60 * 60 * 24
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose) * timeUsdValue,
            open: Number(element.aggregatedOpen) * timeUsdValue,
            high: Number(element.aggregatedHigh) * timeUsdValue,
            low: Number(element.aggregatedLow) * timeUsdValue,
          };
      });

      this.updatedChartData.priceXtz.days7 =
        this.getChartData.volumeAndPrice7Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            close: Number(element.aggregatedClose),
            open: Number(element.aggregatedOpen),
            high: Number(element.aggregatedHigh),
            low: Number(element.aggregatedLow),
          };
        });

      this.updatedChartData.volume.hours1 =
        this.getChartData.volumeAndPrice1Hour.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });

      this.updatedChartData.volume.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });

      this.updatedChartData.volumeXtz.hours1 =
        this.getChartData.volumeAndPrice1Hour.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume),
          };
        });

      this.updatedChartData.volumeXtz.days1 =
        this.getChartData.volumeAndPrice1Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume),
          };
        });

      this.updatedChartData.volume.days7 =
        this.getChartData.volumeAndPrice7Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });
      this.updatedChartData.volumeXtz.days7 =
        this.getChartData.volumeAndPrice7Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume),
          };
        });

      this.updatedChartData.volume.days30 =
        this.getChartData.volumeAndPrice30Day.map((element) => {
          const timeUsdValue = tokenTracker.binarySearch(
            this.getXtzUsdHistory,
            new Date(element.bucket).getTime()
          );
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });
      this.updatedChartData.volumeXtz.days30 =
        this.getChartData.volumeAndPrice30Day.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume),
          };
        });

      this.updatedChartData.volumeXtz.all =
        this.getChartData.allVolumeAndPrice.map((element) => {
          return {
            time: new Date(element.bucket).getTime() / 1000,
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
            time: new Date(element.bucket).getTime() / 1000,
            value: Number(element.aggregatedXtzVolume) * timeUsdValue,
          };
        });
    },

    async getPrices() {
      this.setLoading(true);
      try {
        await this.sortTokenData();

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
            this.duration === "1h"
              ? !this.getShowUsd
                ? this.updatedChartData.priceXtz.hours1
                : this.updatedChartData.price.hours1
              : this.duration === "4h"
              ? !this.getShowUsd
                ? this.updatedChartData.priceXtz.hours4
                : this.updatedChartData.price.hours4
              : this.duration === "1d"
              ? !this.getShowUsd
                ? this.updatedChartData.priceXtz.days1
                : this.updatedChartData.price.days1
              : this.duration === "7d"
                ? !this.getShowUsd
                ? this.updatedChartData.priceXtz.days7
                : this.updatedChartData.price.days7 
              :
                // : this.duration === "30d"
                // ? this.updatedChartData.price.days30
                // : this.duration === "all"
                // ? this.updatedChartData.price.all
                null;
        }

        if (this.legendTab === "volume") {
          this.tokenData =
            this.duration === "1h"
              ? !this.getShowUsd
                ? this.updatedChartData.volumeXtz.hours1
                : this.updatedChartData.volume.hours1
              : this.duration === "1d"
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

        document.getElementById("chart").innerHTML = "";

        var chart = createChart(document.getElementById("chart"), {
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

        var areaSeries = chart.addCandlestickSeries({
          topColor: "rgba(85,92,255,.5)",
          bottomColor: "rgba(85,92,255,.04)",
          lineColor: "rgba(85,92,255,1)",
          lineWidth: 2,
        });

        var candlestickSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        }); 

        if (this.legendTab === "price") {
        // Create and set data for the candlestick series
        candlestickSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });

        candlestickSeries.setData(this.tokenData);

        // Apply price formatting options if needed
        candlestickSeries.applyOptions({
          priceFormat: {
            type: "price",
            precision: this.handlePrecision(this.tokenTracked.usdValue).precision,
            minMove: this.handlePrecision(this.tokenTracked.usdValue).minMove,
          },
        });
      } else if (this.legendTab === "volume") {
        // Create and set data for the area series
        areaSeries = chart.addAreaSeries({
          topColor: "rgba(85,92,255,.5)",
          bottomColor: "rgba(85,92,255,.04)",
          lineColor: "rgba(85,92,255,1)",
          lineWidth: 2,
        });

        areaSeries.setData(this.tokenData);
      }
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
            toolTip.style.display = "block";
          } else {
            const dateStr = this.formatDate(param.time);
            toolTip.style.display = "block";

            let price;
            let priceObj;
            let precision;
            let contentHtml = `<div style="color:var(--color-primary)">${
              this.tokenTracked.symbol || this.tokenTracked.name
            }.</div><div style="font-size: 24px; margin: 0px 0px; color: ${"black"}">`;

            if (this.legendTab === "price") {
              // Set tooltip height
              toolTip.style.height = "140px";
              // Calculate price and precision for the "price" legend tab
              priceObj = param.seriesPrices.get(candlestickSeries);
              let { open, high, low, close } = priceObj;
              open = Number(open).toFixed(
                this.handlePrecision(open).precision
              );
              close = Number(close).toFixed(
                this.handlePrecision(close).precision
              );
              high = Number(high).toFixed(
                this.handlePrecision(high).precision
              );
              low = Number(low).toFixed(
                this.handlePrecision(low).precision
              );
              precision = this.handlePrecision(price).precision;
              contentHtml += `
                <div style="font-size: 14px;">Open: ${this.getShowUsd ? "$" : ""}${
                this.formatNumShorthand(open, precision).value
              }${this.formatNumShorthand(open, precision).suffix}${this.getShowUsd ? "" : "ꜩ"}</div>
                <div style="font-size: 14px;">High: ${this.getShowUsd ? "$" : ""}${
                this.formatNumShorthand(high, precision).value
              }${this.formatNumShorthand(high, precision).suffix}${this.getShowUsd ? "" : "ꜩ"}</div>
                <div style="font-size: 14px;">Low: ${this.getShowUsd ? "$" : ""}${
                this.formatNumShorthand(low, precision).value
              }${this.formatNumShorthand(low, precision).suffix}${this.getShowUsd ? "" : "ꜩ"}</div>
                <div style="font-size: 14px;">Close: ${this.getShowUsd ? "$" : ""}${
                this.formatNumShorthand(close, precision).value
              }${this.formatNumShorthand(close, precision).suffix}${this.getShowUsd ? "" : "ꜩ"}</div>`;
            } 
            
            else {
              // Set tooltip height
              toolTip.style.height = "100px";
              // Calculate price and precision for the "volume" legend tab
              price = Number(param.seriesPrices.get(areaSeries)).toFixed(
                this.handlePrecision(param.seriesPrices.get(areaSeries)).precision
              );
              precision = this.handlePrecision(price).precision;
              contentHtml += `${this.getShowUsd ? "$" : ""}${
                this.formatNumShorthand(price, precision).value
              }${this.formatNumShorthand(price, precision).suffix}${
                !this.getShowUsd ? "ꜩ" : ""
              }<br>`;
            }

            contentHtml += `</div><div style="color: ${"black"}">${dateStr}</div>`;

            toolTip.innerHTML = contentHtml;

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
        precision = 5;
        minMove = 0.00001;
      } else {
        precision = 5;
        minMove = 0.00001;
      }

      return { precision, minMove };
    },

    formatNumShorthand(value, precision) {
       return numberFormat.shorthand(value, precision);
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
