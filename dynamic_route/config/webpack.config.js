const path = require("path"); // 导入path模块
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 导入html-webpack-plugin模块
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin"); // 将tsconfig中的paths配置同步到webpack中

module.exports = {
  // 入口文件
  entry: "./src/index.tsx",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/, // 排除 node_modules 目录
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"], // 自动解析确定的扩展
    plugins: [new TsconfigPathsPlugin()], // 将tsconfig中的paths配置同步到webpack中
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"), // 模板位置
      filename: "index.html", // 输出后的文件名，路径是 output.path
      title: "Bench", // 传给模板的变量
    }),
  ],

  // 出口文件
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js",
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, "../dist"), // 告诉服务器从指定目录中提供静态文件，也即打包后的文件
    },
    port: 2022, // 设置端口
    // open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    historyApiFallback: true, // 支持BrowserRouter
    compress: true, // Enable gzip compression of generated files.
  },

  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename], // 构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
    },
  },
};
