import loadScript from './script-loader.js';

export default function configureTwitterAdsPixel({ config, handlers, window, document }) {
  let promise;

  if (config.preloaded !== true) {
    const src = 'https://static.ads-twitter.com/uwt.js';
    const stub = function () {
      stub.exe ? stub.exe.apply(stub, arguments) : stub.queue.push(arguments);
    };

    stub.version = '1.1';
    stub.queue = [];

    promise = loadScript({ src, globalName: 'twq', stub, window, document });
    window.twq('init', config.id);
  }

  handlers.push(handleEvent.bind(null, config.mappings));

  return promise || Promise.resolve();
}

function handleEvent(mappings, { type, id, properties }) {
  if (type === 'page') {
    return window.twq('track', 'PageView');
  }

  if (type === 'track') {
    return (mappings || [])
      .filter(mapping => mapping.evt === id)
      .forEach(mapping => window.twttr.conversion.trackPid(mapping.pid, properties))
    ;
  }

  return null;
}
