const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const envConfig = require('./env.js');

const config = {
  port: 8010,
  proxyServer: '',
  devPublicPath: '',
  buildPublicPath: '',
};

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = function (env) {
  const isDev = env.env === 'development';
  const publicPath = isDev ? config.devPublicPath : config.buildPublicPath;
  const webpackConfig = {
    mode: isDev ? 'development' : 'production',
    entry: {
      main: resolve('./src/main.js'),
    },
    output: {
      path: resolve('./dist'),
      filename: '[name].js',
      assetModuleFilename: '[name][ext][query]',
      publicPath,
    },
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '@': resolve('src'),
        '@views': resolve('./src/views'),
        '@api': resolve('./src/api'),
        '@utils': resolve('./src/utils'),
        '@common': resolve('./src/common'),
        '@styles': resolve('./src/styles'),
        '@images': resolve('./src/images'),
      },
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          use: 'eslint-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: (file) =>
            /node_modules/.test(file) && !/\.vue\.js/.test(file),
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                transformAssetUrls: {
                  video: ['src', 'poster'],
                  source: 'src',
                  img: 'src',
                  image: ['xlink:href', 'href'],
                  use: ['xlink:href', 'href'],
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.envConfig': JSON.stringify(envConfig[env.env]),
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
        minify: isDev
          ? false
          : {
              collapseWhitespace: true,
              keepClosingSlash: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
      }),
      new VueLoaderPlugin(),
    ].concat(
      isDev
        ? []
        : [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
              patterns: [
                {
                  from: resolve('static'),
                  to: resolve('dist/static'),
                },
              ],
            }),
            new MiniCssExtractPlugin({
              filename: '[name].css',
              chunkFilename: '[name].css',
            }),
            new MiniCssExtractPlugin(),
          ]
    ),
    optimization: {
      minimizer: isDev
        ? []
        : [
            new CssMinimizerPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                  pure_funcs: ['console.log', 'console.error'],
                },
              },
            }),
          ],
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      client: {
        overlay: true,
      },
      static: {
        directory: resolve(__dirname, 'static'),
      },
      open: true,
      port: config.port,
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/proxyApi': {
          target: config.proxyServer,
          changeOrigin: true,
          pathRewrite: {
            '^/proxyApi': '/',
          },
        },
      },
    },
    devtool: isDev ? 'inline-source-map' : false,
  };
  return webpackConfig;
};
