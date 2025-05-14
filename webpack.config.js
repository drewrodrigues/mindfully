const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    // mindfulnessCheck: './src/scripts/mindfulness-check.ts',
    // options: './src/scripts/options.ts',
    // resisted: './src/scripts/resisted.ts',
    ruleChecker: './src/scripts/ruleChecker.ts',
    serviceWorker: './src/scripts/serviceWorker.ts',
    mindfulness: './src/views/MindfulnessCheck.tsx',
    options: './src/views/Options.tsx',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    clean: true,
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
  devServer: {
    static: './dist',
    port: 3000,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'mindfulness.html',
      template: 'public/index.html',
      chunks: ['mindfulness'],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'public/index.html',
      chunks: ['options'],
    }),
    new CopyPlugin({
      patterns: [
        'manifest.json',
        { from: 'src/assets', to: 'assets' },
        { from: 'src/styles', to: 'styles' },
      ],
    }),
  ],
}
