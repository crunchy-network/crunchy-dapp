<template>
  <div style="margin-bottom: 36px">
    <canvas id="myChart" width="100%"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import config from "../utils/stackedChart";
// import { m} from "chart.js/helpers";

export default {
  name: "FarmChart",
  props: {
    labels: Array,
    liquidity: Array,
    totalValue: Array,
  },
  mounted() {
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, config({ labels: this.labels, totalValue: this.totalValue, liquidity: this.liquidity }));

    myChart();
  },
};
</script>

<style lang="scss" scoped></style>
