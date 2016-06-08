import path from 'path';

import webpack from 'webpack';

import postcssCssnext from 'postcss-cssnext';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssReporter from 'postcss-reporter';
import postcssSimpleExtend from 'postcss-simple-extend';
import postcssSimpleVars from 'postcss-simple-vars';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const srcDir = path.resolve(__dirname, 'static');
const distDir = path.resolve(__dirname, 'dist');
const isProd = process.argv.indexOf('-p') !== -1;
const jsFilename = isProd ? '[name].[hash:6].js' : '[name].js';
const cssFilename = isProd ? '[name].[chunkhash:6].css' : '[name].css';

const entryBase = isProd ? [] : ['webpack-hot-middleware/client?reload=true'];

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify((isProd) ? 'production' : 'development'),
    },
  }),
  new webpack.ProvidePlugin({
    Promise: 'exports?global.Promise!es6-promise',
    fetch: 'exports?self.fetch!whatwg-fetch',
  }),
  new HtmlWebpackPlugin({
    template: path.join(srcDir, 'index.html'),
    inject: true,
    favicon: path.join(srcDir, 'icons', 'favicon.ico'),
    minify: {
      removeComments: true,
      collapseWhitespace: true,
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
  }),
];

// ExtractTextPlugin does not work with hot reload
const cssLoader = isProd ? ExtractTextPlugin.extract(
  'style',
  'css!postcss'
) : 'style!css!postcss';

if (isProd) {
  plugins.push(new ExtractTextPlugin(cssFilename, {
    allChunks: true,
  }));
}

export default {
  context: srcDir,
  entry: {
    app: entryBase.concat([
      './index.js',
    ]),
    vendor: entryBase.concat([
      'd3',
      'moment',
      'react',
      'react-dom',
      'react-router',
      'metrics-graphics',
      'classnames',
      'babel-polyfill',
    ]),
  },
  devtool: isProd ? '#source-map' : '#cheap-source-map',
  output: {
    path: distDir,
    filename: jsFilename,
    chunkFilename: jsFilename,
    publicPath: '/',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: srcDir,
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        include: srcDir,
        loader: 'babel',
      }, {
        test: /\.css$/,
        include: srcDir,
        loader: cssLoader,
      }, {
        test: /manifest.json$/,
        loader: 'file?name=manifest.json!web-app-manifest',
      }, {
        test: /\.png$/,
        loaders: [
          'file?name=[path][name].[hash:6].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },
  postcss: [
    postcssImport(),
    postcssSimpleExtend(),
    postcssNested(),
    postcssSimpleVars(),
    postcssCssnext({
      browsers: ['last 1 version'],
    }),
    postcssReporter({
      throwError: true,
    }),
  ],
  plugins: plugins,
  devServer: {
    port: 3000,
    noInfo: true,
  },
};
