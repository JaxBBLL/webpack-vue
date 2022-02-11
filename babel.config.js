module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        modules: false,
        corejs: 3, // 声明corejs版本
      },
    ],
  ],
  plugins: [],
};
