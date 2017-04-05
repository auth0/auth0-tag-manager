import loadScript from './script-loader.js';

export default function configureGoogleAdWords({ id, mappings, handlers, window, document }) {
  const src = 'https://www.googleadservices.com/pagead/conversion_async.js';
  const promise = loadScript({ src, globalName: 'google_trackConversion', stubType: 'function', window, document });

  handlers.push(handleEvent.bind(null, id, mappings));

  return promise;
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
