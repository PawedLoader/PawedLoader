const path = require('path');

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.*.bjs$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // plugins: ['@babel/plugin-syntax-jsx'],
            presets: [
              // ['@babel/preset-react', { targets: 'defaults' }],
              ['@babel/preset-env', { targets: 'defaults' }]
            ]
          }
        }
      },
      {
        test: /\.*.html$/i,
        exclude: /node_modules/,
        use: {
          loader: 'html-loader',
          options: {
            // Disables attributes processing
            minimize: {
              caseSensitive: true,
              collapseWhitespace: true,
              conservativeCollapse: true,
              keepClosingSlash: true,
              minifyCSS: true,
              minifyJS: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
            }
          },
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  mode: 'development',
  devtool: 'source-map',
};