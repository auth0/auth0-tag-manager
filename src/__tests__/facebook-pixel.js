/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('handles the "track" event', () => {
  const TagManager = require('../').default;
  const eventName = 'test_event';
  const manager = TagManager({
    label: 'Something',
    'facebook-pixel': {
      preloaded: true
    }
  });

  window.fbq = jest.fn();

  manager.track(eventName);

  expect(window.fbq).toBeCalledWith('trackCustom', eventName, {});
});

it('handles the "page" event', () => {
  const TagManager = require('../').default;
  const manager = TagManager({
    label: 'Something',
    'facebook-pixel': {
      preloaded: true
    }
  });

  window.fbq = jest.fn();

  manager.page();

  expect(window.fbq).toBeCalledWith('track', 'PageView');
});

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
