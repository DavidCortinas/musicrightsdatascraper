const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace with the path to your entry file
  output: {
    path: path.resolve(__dirname, 'dist'), // Replace with the path to your output directory
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'), // Replace with the path to your output directory
    port: 3000, // Replace with the desired port number
  },
};
