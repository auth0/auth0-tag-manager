/* global FB */
import loadScript from './script-loader.js';
import Deferred from './defered';

export default function configureFacebookAnalytics({ config, handlers, window, document }) {
  let promise = Promise.resolve();

  if (!config.preloaded) {
    const src = 'https://connect.facebook.net/en_US/sdk.js';
    window.fbAsyncInit = function () {
      FB.init({
        appId: config.id,
        xfbml: true,
        version: 'v2.8'
      });
    };

    promise = loadScript({ src, id: 'facebook-jssdk', globalName: 'FB', window, document });
  }

  const deferred = new Deferred();
  deferred.run(() => (typeof FB === 'object' && window.fbAsyncInit.hasRun));

  handlers.push(handleEvent);

  return promise;

  function handleEvent({ type, id, properties, userId }) {
    if (type === 'page') {
      return deferred.push(() => { FB.AppEvents.logPageView(); });
    }

    if (type === 'track') {
      return deferred.push(() => { FB.AppEvents.logEvent(id, null, properties); });
    }

    if (type === 'setUserId' && userId) {
      return deferred.push(() => { FB.AppEvents.setUserID(userId); });
    }

    return null;
  }
}
