#!/bin/bash

NPM_BIN=$(npm bin)
"$NPM_BIN/webpack" --config ./tools/webpack/webpack.config.babel.js
