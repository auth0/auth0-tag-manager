import loadScript from './script-loader.js';

export default function configureGoogleAdWords({ config, handlers, window, document }) {
  let promise;

  if (config.preloaded !== true) {
    const src = 'https://www.googleadservices.com/pagead/conversion_async.js';
    promise = loadScript({ src, globalName: 'google_trackConversion', stubType: 'function', window, document });
  }

  handlers.push(handleEvent.bind(null, config.id, config.mappings));

  return promise || Promise.resolve();
}

function handleEvent(conversionId, mappings, { type, id }) {
  if (type === 'track') {
    return (mappings || [])
      .filter(mapping => mapping.evt === id)
      .forEach((mapping) => {
        window.google_trackConversion({
          google_conversion_id: conversionId,
          google_conversion_label: mapping.label,
          google_remarketing_only: false
        });
      })
    ;
  }

  return null;
}
