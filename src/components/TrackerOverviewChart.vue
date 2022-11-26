<template>
  <div id="chart"></div>
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
            precision: 6,
            minMove: 0.000001,
          },
        });
      }

      areaSeries.setData(areaSeriesData);

      chart.timeScale().fitContent();
    },

    formatDate(date) {
      const d = new Date(date);

      const DD = d.toLocaleString("default", { day: "2-digit" });
      const MMM = d.toLocaleString("default", { month: "short" });
      const YY = d.getFullYear().toString().slice(-2);

      return MMM + " " + DD + ", " + YY;
    },
  },
};
</script>

<style scoped>
#chart {
  width: 100%;
  height: 500px;
  display: flex;
  justify-content: flex-start;
}
</style>
