const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: process.env.NODE_ENV,
  resolve: {
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: [/node_modules/],
        use: ['ts-loader'],
      },
      {
        test: /.(css|scss)$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      { test: /\\.(png|jp(e*)g|svg|gif)$/, 
        use: ['file-loader'], },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, './dist'),
    },
  },
};
