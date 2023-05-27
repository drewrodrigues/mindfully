module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    options: './src/scripts/options.js',
    serviceWorker: './src/scripts/serviceWorker.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
}
