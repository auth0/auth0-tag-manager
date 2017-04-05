import loadScript from './script-loader.js';

export default function configureTwitterAdsPixel({ id, mappings, handlers, window, document }) {
  const src = 'https://static.ads-twitter.com/uwt.js';
  const stub = function () {
    stub.exe ? stub.exe.apply(stub, arguments) : stub.queue.push(arguments);
  };

  stub.version = '1.1';
  stub.queue = [];

  const promise = loadScript({ src, globalName: 'twq', stub, window, document });

  handlers.push(handleEvent.bind(null, mappings));
  window.twq('init', id);

  return promise;
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
