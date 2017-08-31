import loadScript from './script-loader';

export default function configureGoogleTagManager({ config, handlers, window, document }) {
  let promise = Promise.resolve();

  if (!config.preloaded) {
    const src = 'https://www.googletagmanager.com/gtm.js?id=' + config.id;
    const stub = window.dataLayer || [];
    stub.push({ 'gtm.start': new Date().getTime(), event:'gtm.js' });
    promise = loadScript({ src, globalName: 'dataLayer', stub, window, document });
  }

  handlers.push(handleEvent);

  return promise;

  function handleEvent({ type, id: eventAction, properties, label, userId }) {
    const location = window.location || {};
    if (type === 'page') {
      return window.dataLayer.push({
        event: 'pageview',
        page: `${location.pathname}${location.search}${location.hash}`
      });
    }

    if (type === 'track') {
      return window.dataLayer.push({
        event: eventAction,
        eventCategory: properties.category || 'All',
        eventLabel: properties.label || label
      });
    }

    if (type === 'setUserId' && userId) {
      return window.dataLayer.push({
        userId: userId
      });
    }

    return null;
  }

}
