module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    mindfulnessCheck: './src/scripts/mindfulness-check.ts',
    options: './src/scripts/options.js',
    resisted: './src/scripts/resisted.js',
    serviceWorker: './src/scripts/serviceWorker.js',
    popup: './src/scripts/popup.ts',
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
