module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    error: './src/scripts/error.ts',
    mindfulnessCheck: './src/scripts/mindfulness-check.ts',
    options: './src/scripts/options.ts',
    resisted: './src/scripts/resisted.ts',
    ruleChecker: './src/scripts/ruleChecker.ts',
    serviceWorker: './src/scripts/serviceWorker.ts',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
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
