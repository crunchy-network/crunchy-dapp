module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      title: "Crunchy",
    },
  },
  lintOnSave: "warning",
  configureWebpack: {
    module: {
      rules: [
        { test: /node_modules[\\/]@walletconnect/, loader: "babel-loader" },
      ],
    },
  },
};
