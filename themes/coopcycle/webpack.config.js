const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const path = require('path')
const Uglify = require("uglifyjs-webpack-plugin")

const cssFilename = process.env.NODE_ENV === 'production' ? 'css/[name].[contenthash].css' : 'css/[name].css'
const jsFilename = process.env.NODE_ENV === 'production' ? 'js/[name].[chunkhash].js' : 'js/[name].js'

let webpackConfig = {
  entry: {
    style: './src/scss/style.scss',
    index: './src/scripts/index.js'
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, '/static'),
    filename: jsFilename,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: __dirname + '/js',
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        }),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }),
        exclude: /node_modules/,
      },
      {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
          test: /\.svg$/,
          loader: 'file-loader?name=svg/[name].[ext]'
      },
      {
          test: /\.(png)$/,
          loader: 'url-loader'
      },
    ]
  },
  plugins: [
    new Uglify(),
    new ExtractTextPlugin(cssFilename),
  ]
};

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new WebpackAssetsManifest({
    writeToDisk: true,
    output: path.join(__dirname, '/data/manifest.json'),
  }));
}

module.exports = webpackConfig;