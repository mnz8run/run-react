const path = require('path'); // 导入path模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 导入html-webpack-plugin模块
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); // 将tsconfig中的paths配置同步到webpack中

module.exports = {
  // 入口文件
  entry: './src/index.tsx',
  // 出口文件
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // 自动解析确定的扩展
    plugins: [new TsconfigPathsPlugin()], // 将tsconfig中的paths配置同步到webpack中
  },
  module: {
    rules: [
      // 1. 先处理 TypeScript/JavaScript
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },

      // 2. CSS Modules 要优先于普通 CSS/Less
      {
        test: /\.module\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
                modules: true,
                importLoaders: 2,
                // exportLocalsConvention: {
                //   transform: (originalClassName) => {
                //     return originalClassName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                //   },
                // },
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
                exportLocalsConvention: 'camelCase',
              },
            },
          },
        ],
      },

      // 3. 最后处理普通的 CSS/Less
      {
        test: /\.less$/,
        exclude: /\.module\.less$/, // 重要：排除 module.less 文件
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/, // 重要：排除 module.css 文件
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'), // 模板位置
      title: 'Zero', // 传给模板的变量
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, './public'), // 告诉服务器从指定目录中提供静态文件，也即打包后的文件
    },
    port: 2022, // 设置端口
    hot: true, // 开启热更新
    historyApiFallback: true, // 支持BrowserRouter
    compress: true, // Enable gzip compression of generated files.
    // open: true, // 自动打开浏览器
  },

  // cache: {
  //   type: 'filesystem',
  //   buildDependencies: {
  //     config: [__filename], // 构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
  //   },
  // },
};
