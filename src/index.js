import Promise from 'promiscuous';
import config from '../config';
import logger from './logger';
import configureFacebookPixel from './facebook-pixel';
import configureGoogleAnalitycs from './google-analytics';
import configureTwitterAdsPixel from './twitter-ads-pixel';
import configureGoogleAdWords from './google-adwords';

export function initialize(label = 'website', callback) {
  const promises = [];
  const handlers = [];
  const tagManager = {
    page: () => {
      handlers.forEach((handler) => {
        try {
          handler({ type: 'page', label });
        } catch (error) {
          logger.error('Error on page() handler');
          logger.error(error);
        }
      });
    },
    track: (id, properties = {}) => {
      handlers.forEach((handler) => {
        try {
          handler({ type: 'track', id, properties, label });
        } catch (error) {
          logger.error('Error on page() handler');
          logger.error(error);
        }
      });
    }
  };

  promises.push(configureFacebookPixel({ id: config['facebook-pixel'].id, handlers, window, document }));
  promises.push(configureGoogleAnalitycs({ id: config['google-analytics'].id, handlers, window, document }));
  promises.push(configureTwitterAdsPixel({ id: config['twitter-ads-pixel'].id, mappings: config['twitter-ads-pixel'].mappings, handlers, window, document }));
  promises.push(configureGoogleAdWords({ id: config['google-adwords'].id, mappings: config['google-adwords'].mappings, handlers, window, document }));

  Promise.all(promises)
    .then(() => {
      if (callback) callback(null, tagManager);
      return tagManager;
    })
    .catch((error) => {
      if (callback) callback(error);
      return Promise.reject(error);
    })
  ;

  return tagManager;
}

export default initialize;
