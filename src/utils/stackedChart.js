export default function config(params = { labels: [], totalValue: [], liquidity: [] }) {
  const data = {
    labels: params.labels,
    datasets: [
      {
        label: "Farm Liquidity",
        data: params.liquidity,
        backgroundColor: "#1EC391",
      },
      {
        label: "Farm Total Value",
        data: params.totalValue,
        backgroundColor: "#555CFF",
      },
    ],
  };
  // </block:setup>

  // <block:config:0>
  const config = {
    type: "bar",
    data: data,
    options: {
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          barPercentage: 0.4,
          grid: {
            display: false,
            borderWidth: 0,
          },
        },
        y: {
          stacked: true,
          grid: {
            borderWidth: 0,
            borderDash: [8, 4],
          },
          ticks: {
            display: false,
          },
        },
      },
    },
  };

  return config;
}
