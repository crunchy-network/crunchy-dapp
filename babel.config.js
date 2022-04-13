module.exports = {
  presets: ["@vue/cli-plugin-babel/preset", "@babel/preset-env"],
  plugins: [
    "@babel/plugin-proposal-numeric-separator",
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
  include: [/src/, /node_modules/],
  exclude: [],
  ignore: [],
};
