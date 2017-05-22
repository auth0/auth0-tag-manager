import loadScript from './script-loader.js';

export default function configureGoogleAnalitycs({ config, handlers, window, document }) {
  let promise;

  if (config.preloaded !== true) {
    const src = 'https://www.google-analytics.com/analytics.js';
    const stub = function () {
      stub.q.push(arguments);
    };
    stub.q = [];
    stub.l = 1 * new Date();
    window.GoogleAnalyticsObject = 'ga';

    promise = loadScript({ src, globalName: 'ga', stub, window, document });
    window.ga('create', congig.id, 'auto');
  }

  handlers.push(handleEvent);

  return promise || Promise.resolve();

  function handleEvent({ type, id: eventAction, properties, label }) {
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

    if (type === 'setUserId') {
      return window.ga('set', 'userId', id);
    }

    return null;
  }
}
