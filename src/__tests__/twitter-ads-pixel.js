/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('handles the "track" event', () => {
  const TagManager = require('../').default;
  const eventName = 'test_event';
  const manager = TagManager({
    label: 'Something',
    'twitter-ads-pixel': {
      preloaded: true,
      mappings: [{
        evt: eventName,
        pid: eventName
      }]
    }
  });
  
  window.twttr = { conversion: { trackPid: jest.fn() } };
  
  manager.track(eventName);
  
  expect(window.twttr.conversion.trackPid).toBeCalledWith(eventName, {});
});

it('handles the "page" event', () => {
  const TagManager = require('../').default;
  const eventName = 'test_event';
  const manager = TagManager({
    label: 'Something',
    'twitter-ads-pixel': {
      preloaded: true,
      mappings: [{
        evt: eventName,
        pid: eventName
      }]
    }
  });
  
  window.twq = jest.fn();
  
  manager.page();
  
  expect(window.twq).toBeCalledWith('track', 'PageView');
});

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
