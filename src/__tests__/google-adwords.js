/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('handles the "track" event', () => {
  const TagManager = require('../').default;
  const eventName = 'test_event';
  const manager = TagManager({
    label: 'Something',
    'google-adwords': {
      preloaded: true,
      mappings: [
        {
          evt: eventName
        }
      ]
    }
  });

  window.google_trackConversion = jest.fn();

  manager.track(eventName);

  expect(window.google_trackConversion).toBeCalled();
});

it('loads in google adwords', () => {
  const configureGoogleAdwords = require('../google-adwords').default;
  expectLoadScriptToBeCalled(configureGoogleAdwords);
});

it('calls configureGoogleAdwords when config is set', () => {
  const configureGoogleAdwords = require('../google-adwords');
  configureGoogleAdwords.default = jest.fn();

  const TagManager = require('../').default;
  TagManager({
    label: 'Something',
    'google-adwords': {}
  });

  expect(configureGoogleAdwords.default).toBeCalled();
});
