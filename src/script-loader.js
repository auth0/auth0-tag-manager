import logger from './logger';

export default function loadScript({ src, globalName, globalNames, stubType, stubMethods, stub = null, window, document }, callback) {
  const script = document.createElement('script');
  const first = document.getElementsByTagName('script')[0];
  const internalStub = stub || createStub(stubType, stubMethods);

  if (internalStub) {
    if (globalName) window[globalName] = internalStub;
    (globalNames || []).forEach(name => { window[name] = internalStub; });
  }

  script.async = true;
  script.src = src;
  script.type = 'text/javascript';

  const promise = new Promise((resolve, reject) => {
    script.onerror = () => {
      const error = `Error loading ${src}`;

      logger.debug(error);
      if (internalStub && internalStub._onError) {
        internalStub._onError(error);
      }

      if (callback) {
        callback(error);
      }

      reject(error);
    };

    script.onload = () => {
      logger.debug(`${src} loaded successfully`);
      if (internalStub && internalStub._onLoad) {
        internalStub._onLoad(window[globalName || globalNames[0]]);
      }

      if (callback) {
        callback(null, window[globalName || globalNames[0]]);
      }

      resolve(window[globalName || globalNames[0]]);
    };
  });

  first.parentNode.insertBefore(script, first);

  return promise;
}

function createStub(stubType, stubMethods) {
  if (stubType === 'function') {
    return createFunctionStub(stubMethods);
  }

  return null;
}

function createFunctionStub(stubMethods) {
  const enqueueCall = (target, method, args) => {
    target._queue = target._queue || [];
    target._queue.push({ method, args });
    return target;
  };

  const stub = (...args) => enqueueCall(stub, null, args);

  (stubMethods || []).forEach((method) => {
    stub[method] = (...args) => enqueueCall(stub, method, args);
  });

  stub._onLoad = (library) => {
    while ((stub._queue || []).length) {
      const call = stub._queue.shift();
      call.method ? library[call.method](...call.args) : library(...call.args);
    }
  };

  return stub;
}
