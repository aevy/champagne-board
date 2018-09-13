const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/js"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    alias: {
      HOC: path.resolve(__dirname, "src/hocs/"),
      Lib: path.resolve(__dirname, "src/lib/"),
      Redux: path.resolve(__dirname, "src/redux/"),
      Components: path.resolve(__dirname, "src/components/")
    }
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /(\.less$|\.css$)/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          {
            loader: "less-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src/index.html"),
        to: path.resolve(__dirname, "dist/index.html")
      },
      {
        from: path.resolve(__dirname, "src/assets/spinner.gif"),
        to: path.resolve(__dirname, "dist/assets/spinner.gif")
      }
    ])
  ],
  stats: {
    warnings: false
  }
};
