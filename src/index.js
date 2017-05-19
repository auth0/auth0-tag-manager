import logger from './logger';
import configureFacebookPixel from './facebook-pixel';
import configureGoogleAnalitycs from './google-analytics';
import configureTwitterAdsPixel from './twitter-ads-pixel';
import configureGoogleAdWords from './google-adwords';

function handleError(error, callback) {
  if (callback) {
    return callback(error);
  }
  return Promise.reject(error);
}

export function initialize(config, callback) {
  if (!config) {
    return handleError(new Error('config is required.'), callback);
  }
  if (!config.label) {
    return handleError(new Error('config.label is required.'), callback);
  }

  const promises = [];
  const handlers = [];
  const tagManager = {
    page: () => {
      handlers.forEach((handler) => {
        try {
          handler({ type: 'page', label: config.label });
        } catch (error) {
          logger.error('Error on page() handler');
          logger.error(error);
        }
      });
    },
    track: (id, properties = {}) => {
      handlers.forEach((handler) => {
        try {
          handler({ type: 'track', id, properties, label: config.label });
        } catch (error) {
          logger.error('Error on page() handler');
          logger.error(error);
        }
      });
    }
  };

  if (config['facebook-pixel'] && config['facebook-pixel'].id) {
    promises.push(configureFacebookPixel({ id: config['facebook-pixel'].id, handlers, window, document }));
  }
  if (config['google-analytics'] && config['google-analytics'].id) {
    promises.push(configureGoogleAnalitycs({ id: config['google-analytics'].id, handlers, window, document }));
  }
  if (config['twitter-ads-pixel'] && config['twitter-ads-pixel'].id) {
    promises.push(configureTwitterAdsPixel({ id: config['twitter-ads-pixel'].id, mappings: config['twitter-ads-pixel'].mappings, handlers, window, document }));
  }
  
  if (config['google-adwords'] && config['google-adwords'].id) {
    promises.push(configureGoogleAdWords({ id: config['google-adwords'].id, mappings: config['google-adwords'].mappings, handlers, window, document }));
  }

  Promise.all(promises)
    .then(() => {
      if (callback) callback(null, tagManager);
      return tagManager;
    })
    .catch((error) => {
      return handleError(error, callback);
    })
  ;

  return tagManager;
}

export default initialize;
