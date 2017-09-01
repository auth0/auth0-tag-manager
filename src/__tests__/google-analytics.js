/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';


it('loads in google analytics', () => {
  const configureGoogleAnalytics = require('../google-analytics').default;

  // Mock google analytics function
  window.ga = jest.fn();

  expectLoadScriptToBeCalled(configureGoogleAnalytics);
});

it('calls configureGoogleAnalytics when config is set', () => {
  const configureGoogleAnalytics = require('../google-analytics');
  configureGoogleAnalytics.default = jest.fn();

  const TagManager = require('../').default;
  TagManager({
    label: 'Something',
    'google-analytics': {}
  });

  expect(configureGoogleAnalytics.default).toBeCalled();
});
