#!/bin/bash

NPM_BIN=$(npm bin)
node "$NPM_BIN/webpack" --config ./tools/webpack/webpack.config.babel.js
cp ./tools/scripts/es5.js ./es5.js
babel src --out-dir lib
