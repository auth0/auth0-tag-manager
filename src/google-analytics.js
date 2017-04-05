import loadScript from './script-loader.js';

export default function configureGoogleAnalitycs({ id, handlers, window, document }) {
  const src = 'https://www.google-analytics.com/analytics.js';
  const stub = function () {
    stub.q.push(arguments);
  };
  stub.q = [];
  stub.l = 1 * new Date();
  window.GoogleAnalyticsObject = 'ga';

  const promise = loadScript({ src, globalName: 'ga', stub, window, document });

  handlers.push(handleEvent);
  window.ga('create', id, 'auto');

  return promise;
}

function handleEvent({ type, id, properties, label }) {
  if (type === 'page') {
    return window.ga('send', 'pageview');
  }

  if (type === 'track') {
    const gaEvent = {
      hitType: 'event',
      eventCategory: properties.category || 'All',
      eventAction: id,
      eventLabel: properties.label || label
    };
    return window.ga('send', gaEvent);
  }

  return null;
}
