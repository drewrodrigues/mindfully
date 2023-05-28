module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    options: './src/scripts/options.js',
    resisted: './src/scripts/resisted.js',
    serviceWorker: './src/scripts/serviceWorker.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  // typescript
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
}
