import loadScript from './script-loader.js';

export default function configureFacebookAnalitycs({ config, handlers, window, document }) {
  const src = 'https://connect.facebook.net/en_US/sdk.js';
  window.fbAsyncInit = function() {
    FB.init({
      appId      : config.id,
      xfbml      : true,
      version    : 'v2.8'
    });
  };

  const promise = loadScript({ src, id: 'facebook-jssdk', globalName: 'FB', window, document });

  handlers.push(handleEvent);

  return promise;

  function handleEvent({ type, id, properties }) {
    const location = window.location || {};
    if (type === 'page') {
      return FB.AppEvents.logPageView();
    }

    if (type === 'track') {
      FB.AppEvents.logEvent(id, properties);
    }

    if (type === 'setUserId') {
      FB.AppEvents.setUserID(id);
    }

    return null;
  }
}
