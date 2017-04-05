import path from 'path';
import config from './webpack.config.babel';

config.output.path = path.join(__dirname, '../playground/build');

export default config;
