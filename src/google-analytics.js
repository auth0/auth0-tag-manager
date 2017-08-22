import loadScript from './script-loader.js';

export default function configureGoogleAnalitycs({ config, handlers, window, document }) {
  let promise = Promise.resolve();

  if (!config.preloaded) {
    const src = 'https://www.google-analytics.com/analytics.js';
    const stub = function () {
      stub.q.push(arguments);
    };
    stub.q = [];
    stub.l = 1 * new Date();
    window.GoogleAnalyticsObject = 'ga';

    promise = loadScript({ src, globalName: 'ga', stub, window, document });
    window.ga('create', config.id, 'auto');
  }

  handlers.push(handleEvent);

  return promise;

  function handleEvent({ type, id: eventAction, properties, label, userId }) {
    const location = window.location || {};
    if (type === 'page') {
      return window.ga('send', 'pageview', {
        page: `${location.pathname}${location.search}${location.hash}`
      });
    }

    if (type === 'track') {
      const gaEvent = {
        hitType: 'event',
        eventCategory: properties.category || 'All',
        eventAction,
        eventLabel: properties.label || label
      };
      return window.ga('send', gaEvent);
    }

    if (type === 'setUserId' && userId) {
      return window.ga('set', 'userId', userId);
    }

    return null;
  }
}
