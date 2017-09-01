/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('loads in twitter ads pixel', () => {
  const configureTwitterAdsPixel = require('../twitter-ads-pixel').default;

  // Mock twitter pixel function
  window.twq = jest.fn();

  expectLoadScriptToBeCalled(configureTwitterAdsPixel);
}); 

it('calls configureTwitterAdsPixel when config is set', () => {
  const configureTwitterAdsPixel = require('../twitter-ads-pixel');
  configureTwitterAdsPixel.default = jest.fn();

  const TagManager = require('../').default;
  TagManager({
    label: 'Something',
    'twitter-ads-pixel': {}
  });

  expect(configureTwitterAdsPixel.default).toBeCalled();
});
