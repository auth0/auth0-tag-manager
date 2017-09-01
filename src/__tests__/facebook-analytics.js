/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('loads in facebook analytics', () => {
  const configureFacebookAnalytics = require('../facebook-analytics').default;
  expectLoadScriptToBeCalled(configureFacebookAnalytics);
});

it('calls configureFacebookAnalytics when config is set', () => {
  const configureFacebookAnalytics = require('../facebook-analytics');
  configureFacebookAnalytics.default = jest.fn();
  window.fbq = jest.fn();

  const TagManager = require('../').default;
  TagManager({
    label: 'Something',
    'facebook-analytics': {}
  });

  expect(configureFacebookAnalytics.default).toBeCalled();
});
