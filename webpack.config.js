const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

// get the current package.json version
const { version } = require('./package.json')
const semver = require('semver')

// extract the major (left-most) number
const { major } = semver.parse(version)

module.exports = {
  entry: './src/index.tsx',
  mode: isProduction ? 'production' : 'development',
  output: {
    library: 'MAD',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist', `v${major}`),
    filename: `widget${isProduction ? '.min' : ''}.js`
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    isProduction
      ? undefined
      : new HTMLWebpackPlugin({
          template: path.resolve(__dirname, 'index.html')
        }),
    isProduction ? undefined : new webpack.HotModuleReplacementPlugin()
  ].filter(Boolean)
}
