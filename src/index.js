import logger from './logger';
import configureFacebookPixel from './facebook-pixel';
import configureFacebookAnalytics from './facebook-analytics';
import configureGoogleAnalitycs from './google-analytics';
import configureGoogleTagManager from './google-tag-manager';
import configureTwitterAdsPixel from './twitter-ads-pixel';
import configureGoogleAdWords from './google-adwords';

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
    },
    setUserId: (userId) => {
      handlers.forEach((handler) => {
        try {
          handler({ type: 'setUserId', userId });
        } catch (error) {
          logger.error('Error on setUserId() handler');
          logger.error(error);
        }
      });
    }
  };

  if (config['facebook-pixel']) {
    promises.push(configureFacebookPixel({ config: config['facebook-pixel'], handlers, window, document }));
  }

  if (config['facebook-analytics']) {
    promises.push(configureFacebookAnalytics({ config: config['facebook-analytics'], handlers, window, document }));
  }

  if (config['google-analytics']) {
    promises.push(configureGoogleAnalitycs({ config: config['google-analytics'], handlers, window, document }));
  }

  if (config['google-tag-manager']) {
    promises.push(configureGoogleTagManager({ config: config['google-tag-manager'], handlers, window, document }));
  }

  if (config['twitter-ads-pixel']) {
    promises.push(configureTwitterAdsPixel({ config: config['twitter-ads-pixel'], handlers, window, document }));
  }

  if (config['google-adwords']) {
    promises.push(configureGoogleAdWords({ config: config['google-adwords'], handlers, window, document }));
  }

  Promise.all(promises)
    .then(() => {
      if (callback) callback(null, tagManager);
      return tagManager;
    })
    .catch((error) => handleError(error, callback));

  return tagManager;
}

function handleError(error, callback) {
  if (callback) {
    return callback(error);
  }
  return Promise.reject(error);
}

export default initialize;
