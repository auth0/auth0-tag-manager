import loadScript from './script-loader.js';
import Deferred from './defered';

export default function configureFacebookAnalitycs({ config, handlers, window, document }) {
  
  let promise;

  if (config.preloaded !== true) {
    const src = 'https://connect.facebook.net/en_US/sdk.js';
    window.fbAsyncInit = function() {
      FB.init({
        appId      : config.id,
        xfbml      : true,
        version    : 'v2.8'
      });
    };

    promise = loadScript({ src, id: 'facebook-jssdk', globalName: 'FB', window, document });
  }

  const deferred = new Deferred();
  deferred.run(() => {
    return (typeof FB === 'object' && window.fbAsyncInit.hasRun);
  });

  handlers.push(handleEvent);

  return promise || Promise.resolve();

  function handleEvent({ type, id, properties, userId }) {
    if (type === 'page') {
      return deferred.push(() => { FB.AppEvents.logPageView(); });
    }

    if (type === 'track') {
      return deferred.push(() => { FB.AppEvents.logEvent(id, null, properties); });
    }

    if (type === 'setUserId') {
      return deferred.push(() => { FB.AppEvents.setUserID(userId); });
    }

    return null;
  }
}
