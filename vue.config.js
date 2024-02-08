const webpack = require("webpack");

module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      title: "Crunchy",
    },
  },
  lintOnSave: "warning",
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      fallback: {
        "fs": false,
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
      },
    },
    module: {
      rules: [
        { test: /node_modules[\\/]@walletconnect/, loader: "babel-loader" },
      ],
    },
  },
};
