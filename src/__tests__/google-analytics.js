/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('handles the "track" event', () => {
  const TagManager = require('../').default;

  const eventName = 'test_event';
  const label = 'Something';

  const manager = TagManager({
    label,
    'google-analytics': {
      preloaded: true
    }
  });

  window.ga = jest.fn();

  manager.track(eventName);
  expect(window.ga).toHaveBeenCalledWith('send', {
    eventAction: eventName,
    eventCategory: 'All',
    eventLabel: label,
    hitType: 'event'
  });
});

it('handles the "page" event', () => {
  const TagManager = require('../').default;

  const label = 'Something';
  const manager = TagManager({
    label,
    'google-analytics': {
      preloaded: true
    }
  });

  window.ga = jest.fn();

  manager.page();
  expect(window.ga).toHaveBeenCalledWith('send', 'pageview', { page: 'blank' });
});

it('handles the "setUserID" event', () => {
  const TagManager = require('../').default;

  const label = 'Something';
  const userId = 'abc123';

  const manager = TagManager({
    label,
    'google-analytics': {
      preloaded: true
    }
  });

  window.ga = jest.fn();

  manager.setUserId(userId);
  expect(window.ga).toHaveBeenCalledWith('set', 'userId', userId);
});

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
