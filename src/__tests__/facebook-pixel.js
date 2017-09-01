/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('loads in facebook pixel', () => {
  const configureFacebookPixel = require('../facebook-pixel').default;
  
  // Mock facebook pixel function
  window.fbq = jest.fn();
  
  expectLoadScriptToBeCalled(configureFacebookPixel);
});

it('calls configureFacebookPixel when config is set', () => {
  const configureFacebookPixel = require('../facebook-pixel');
  configureFacebookPixel.default = jest.fn();
  
  const TagManager = require('../').default;
  TagManager({
    label: 'Something',
    'facebook-pixel': {}
  });
  
  expect(configureFacebookPixel.default).toBeCalled();
});