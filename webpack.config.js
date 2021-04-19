const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
// const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
  entry: './src/main.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public" },
      ],
    }),
    // new BrowserSyncPlugin({
    //   host: 'localhost',
    //   port: 3000,
    //   server: {
    //     baseDir: ["./dist"]
    //   }
    // })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  watch: true,
  devtool: "source-map",
};