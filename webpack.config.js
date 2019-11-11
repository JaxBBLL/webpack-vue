const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = {
  port: 8088,
  proxyServer: '',
  devPublicPath: '',
  buildPublicPath: ''
}

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    filename: resolve('dist/index.html'),
    template: 'index.html'
  })
]

const buildPlugins = [
  new CleanWebpackPlugin(),
  new CopyWebpackPlugin([
    {
      from: resolve('static'),
      to: resolve('dist/static')
    }
  ]),
  new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    },
    filename: resolve('dist/index.html'),
    template: 'index.html'
  }),
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:5].css',
    chunkFilename: 'css/[name].[contenthash:5].css'
  }),
  new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorPluginOptions: {
      preset: ['default', { discardComments: { removeAll: true } }]
    },
    canPrint: true
  })
]

module.exports = function(env) {
  const isDev = env === 'development'
  const publicPath = isDev ? config.devPublicPath : config.buildPublicPath
  const webpackConfig = {
    mode: isDev ? 'development' : 'production',
    entry: {
      index: './src/index.js'
    },
    output: {
      path: resolve('dist'),
      filename: isDev ? '[name].js' : 'js/[name].[contenthash:5].js',
      chunkFilename: isDev ? '[name].js' : 'js/[name].[contenthash:5].js',
      publicPath: publicPath
    },
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '@': resolve('src')
      }
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          use: 'eslint-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file)
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
                  use: ['xlink:href', 'href']
                }
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 2 }
            },
            'postcss-loader',
            'less-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              // [path][name].[ext] path是绝对路径
              name: isDev ? '[path][name].[ext]' : 'assets/[name]-[hash:5].[ext]',
              publicPath: publicPath,
              outputPath: ''
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      new VueLoaderPlugin()
    ].concat(isDev ? devPlugins : buildPlugins),
    devtool: isDev ? 'cheap-module-eval-source-map' : 'none',
    devServer: {
      overlay: true,
      contentBase: resolve('dist/'),
      open: true,
      port: config.port,
      hot: true,
      proxy: {
        '/proxyApi': {
          target: config.proxyServer,
          changeOrigin: true,
          pathRewrite: {
            '^/proxyApi': '/'
          }
        }
      }
    }
  }

  if (!isDev) {
    webpackConfig.optimization = {
      usedExports: true, // 开启Tree Shaking
      sideEffects: true, // 副作用
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log']
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: {
        name: 'manifest'
      }
    }
  }
  return webpackConfig
}
