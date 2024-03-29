module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    mindfulnessCheck: './src/scripts/mindfulness-check.ts',
    options: './src/scripts/options.ts',
    resisted: './src/scripts/resisted.ts',
    serviceWorker: './src/scripts/serviceWorker.ts',
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
