/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

it('handles the event', () => {
  const configureFacebookAnalytics = require('../facebook-analytics').default;
  const deferred = require('../defered');
  const items = [];

  deferred.default = jest.fn(function () {
    this.push = i => {
      items.push(i);
    };

    this.run = fn => {};
  });

  const TagManager = require('../').default;
  const manager = TagManager({
    label: 'Something',
    'facebook-analytics': { preloaded: true }
  });

  manager.track('test_event');

  expect(items).toHaveLength(1);

  manager.page();

  expect(items).toHaveLength(2);

  manager.setUserId('abc123');

  expect(items).toHaveLength(3);

  // If no user is is passed the event should not fire.
  manager.setUserId();
  expect(items).toHaveLength(3);
});

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
