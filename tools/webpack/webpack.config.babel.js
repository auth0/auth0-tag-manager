import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

if (!process.env.NODE_ENV) {
  throw new Error('Define a NODE_ENV env var with "development" or "production".');
}

const DEBUG = process.env.NODE_ENV === 'development';

const config = {
  entry: path.join(__dirname, '../../src/index.js'),
  output: {
    path: path.join(__dirname, '../../build/'),
    library: 'auth0TagManager',
    libraryTarget: 'umd',
    filename: 'auth0-tag-manager.js'
  },

  module: {
    rules: [{
      test: /\.js$/,
      include: [path.join(__dirname, '../../src')],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['latest', { modules: false }], 'stage-2'],
          plugins: ['transform-export-extensions', 'es6-promise'],
          env: {
            development: {
              plugins: []
            },
            test: {
              plugins: ['transform-es2015-modules-commonjs']
            }
          }
        }
      }
    }],
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      sourceMap: true,
      minimize: true,
      options: {
        context: __dirname
      }
    }),
    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"'
    }),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),

    ...DEBUG ? [] : [
      // Minimize all JavaScript output
      // https://github.com/mishoo/UglifyJS2#compressor-options
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        },
        sourceMap: true
      })
    ]
  ],

  resolve: {
    modules: [path.join(__dirname, '../../src'), 'node_modules']
  },
  // Watcher doesn't work well if you mistype casing in a path so we use
  // a plugin that prints an error when you attempt to do this.
  // See https://github.com/facebookincubator/create-react-app/issues/240
  cache: DEBUG,

  stats: {
    colors: true,
    timings: true
  },

  devtool: DEBUG ? 'inline-source-map' : 'source-map'
};

export default config;
