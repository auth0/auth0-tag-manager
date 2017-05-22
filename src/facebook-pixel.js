import loadScript from './script-loader.js';

export default function configureFacebookPixel({ config, handlers, window, document }) {

  let promise;

  if (config.load === false) {
    const src = 'https://connect.facebook.net/en_US/fbevents.js';
    const stub = function () {
      stub.callMethod ?
        stub.callMethod.apply(stub, arguments) : stub.queue.push(arguments);
    };
    stub.push = stub;
    stub.loaded = !0;
    stub.version = '2.0';
    stub.queue = [];

    promise = loadScript({ src, globalNames: ['fbq', '_fbq'], stub, window, document });

    window.fbq('init', config.id);
  }
  
  handlers.push(handleEvent);

  return promise || Promise.resolve();
}

function handleEvent({ type, id, properties }) {
  if (type === 'page') {
    return window.fbq('track', 'PageView');
  }

  if (type === 'track') {
    return window.fbq('trackCustom', id, properties);
  }

  // TODO: Facebook Pixel does not yet support Setting the 
  // UserId like Facebook SDK does.

  return null;
}
