import path from 'path';

import webpack from 'webpack';

import postcssCssnext from 'postcss-cssnext';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssReporter from 'postcss-reporter';
import postcssSimpleExtend from 'postcss-simple-extend';
import postcssVariables from 'postcss-css-variables';
import mqpacker from 'css-mqpacker';

import HtmlWebpackPlugin from 'html-webpack-plugin';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';

const srcDir = path.resolve(__dirname, 'static');
const distDir = path.resolve(__dirname, 'dist');
const isProd = process.argv.indexOf('-p') !== -1;
const jsFilename = isProd ? '[name].[hash:6].js' : '[name].js';
const cssFilename = isProd ? '[name].[chunkhash:6].css' : '[name].css';
const entryBase = isProd
  ? []
  : ['react-hot-loader/patch', 'webpack-hot-middleware/client?reload=true'];

const plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$|jquery/, /moment$/),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isProd ? 'production' : 'development'),
    },
  }),
  new webpack.ProvidePlugin({
    Promise: 'exports-loader?global.Promise!es6-promise',
    fetch: 'exports-loader?self.fetch!whatwg-fetch',
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
];

if (!isProd) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

export default {
  context: srcDir,
  entry: {
    app: entryBase.concat(['./index.js']),
    // vendor: entryBase.concat([
    //   'd3',
    //   'moment',
    //   'react',
    //   'react-dom',
    //   'react-router',
    //   'metrics-graphics',
    //   'classnames',
    //   'babel-polyfill',
    // ]),
  },
  devtool: '#source-map',
  output: {
    path: distDir,
    filename: jsFilename,
    chunkFilename: jsFilename,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: srcDir,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        include: srcDir,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                postcssImport(),
                postcssSimpleExtend(),
                postcssNested(),
                postcssVariables(),
                postcssCssnext({
                  browsers: ['last 1 version'],
                }),
                postcssReporter({
                  throwError: true,
                }),
                mqpacker(),
              ],
            },
          },
        ],
      },
      {
        test: /manifest.json$/,
        use: ['file-loader?name=manifest.json', 'web-app-manifest'],
      },
      {
        test: /\.png$/,
        use: [
          'file-loader?name=[path][name].[hash:6].[ext]',
          // 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },
  plugins: plugins,
  devServer: {
    port: 3000,
    noInfo: true,
    stats: 'errors-only',
    quiet: true,
  },
};
