module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss/nesting"),
    require("tailwindcss"),
    require("postcss-custom-properties")({
      importFrom: "src/styles/global.css",
    }),
    require("autoprefixer"),
  ],
};
