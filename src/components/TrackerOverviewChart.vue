<template>
  <div id="chart"></div>
</template>

<script>
import axios from "axios";
import { createChart } from "lightweight-charts";

export default {
  mounted() {
    this.getPrices();
  },
  methods: {
    async getPrices() {
      const prices = (
        await axios.get(
          `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=10000`
        )
      ).data;
      const areaSeriesData = prices.map((price) => {
        return {
          time: price[0],
          value: price[1],
        };
      });
      const colors = {
        red: "rgba(255,82,82, 0.4)",
        green: "rgba(0, 150, 136, 0.6)",
      };
      const randomlyChooseColor = () => {
        const colorValues = Object.values(colors);
        return colorValues[Math.floor(Math.random() * colorValues.length)];
      };
      const volumeSeriesData = prices.map((price) => {
        return {
          time: price[0],
          value: price[1],
          color: randomlyChooseColor(),
        };
      });
      console.log(volumeSeriesData);
      var chart = createChart(document.getElementById("chart"), {
        rightPriceScale: {
          visible: false,
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
          horzLines: {
            visible: false,
            color: "#10002A",
          },
          vertLines: {
            color: "rgba( 247, 147, 26, 0.05)",
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

      var volumeSeries = chart.addHistogramSeries({
        color: "#26a69a",
        lineWidth: 2,
        priceFormat: {
          type: "volume",
        },
        overlay: true,
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      areaSeries.setData(areaSeriesData);
      volumeSeries.setData(volumeSeriesData);
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
}
</style>
