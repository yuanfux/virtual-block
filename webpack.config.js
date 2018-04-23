var path = require('path')
var webpack = require('webpack')

const env = process.env.NODE_ENV

var demoConfig = {
  mode: env || 'development',
  entry: './demo/src/index.js',
  output: {
    path: path.resolve(__dirname, 'docs/'), // local path
    publicPath: '/demo/dist', // public path can be accessed thru browser
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  devServer: {
    compress: true,
    port: 9000
  }
}

var devConfig = {
  mode: env || 'development',
  entry: './dev/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dev/dist'), // local path
    publicPath: '/dev/dist/', // public path can be accessed thru browser
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  devServer: {
    compress: true,
    port: 9000
  }
}

var libConfig = {
  mode: env || 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'index.js',
    library:'virtual-block',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    vue: 'vue'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  performance: {
    hints: false
  },
  devtool: '#source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
}

module.exports = [demoConfig, devConfig, libConfig]