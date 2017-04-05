import loadScript from './script-loader.js';

export default function configureFacebookPixel({ id, handlers, window, document }) {
  const src = 'https://connect.facebook.net/en_US/fbevents.js';
  const stub = function () {
    stub.callMethod ?
      stub.callMethod.apply(stub, arguments) : stub.queue.push(arguments);
  };
  stub.push = stub;
  stub.loaded = !0;
  stub.version = '2.0';
  stub.queue = [];

  const promise = loadScript({ src, globalNames: ['fbq', '_fbq'], stub, window, document });

  handlers.push(handleEvent);
  window.fbq('init', id);

  return promise;
}

function handleEvent({ type, id, properties }) {
  if (type === 'page') {
    return window.fbq('track', 'PageView');
  }

  if (type === 'track') {
    return window.fbq('trackCustom', id, properties);
  }

  return null;
}
