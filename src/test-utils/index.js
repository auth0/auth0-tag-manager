/* eslint-disable no-undef, new-cap */

export function expectLoadScriptToBeCalled(analyticsModule) {
  const loadScript = require('../script-loader');
  loadScript.default = jest.fn();

  analyticsModule({
    config: { preloaded: false },
    window,
    document,
    handlers: []
  });

  expect(loadScript.default).toBeCalled();
}
