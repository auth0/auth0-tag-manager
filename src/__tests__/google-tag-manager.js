/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';


it('handles the "track" event', () => {
  const TagManager = require('../').default;
  
  const label = 'Something';
  const eventName = 'test_event';
  const manager = TagManager({
    label,
    'google-tag-manager': {
      preloaded: true
    }
  });
  
  window.dataLayer = { push: jest.fn() };

  manager.track(eventName);
  expect(window.dataLayer.push).toHaveBeenCalledWith({
    event: eventName,
    eventCategory: "All",
    eventLabel: label
  });
});

it('handles the "page" event', () => {
  const TagManager = require('../').default;
  
  const label = 'Something';
  const manager = TagManager({
    label,
    'google-tag-manager': {
      preloaded: true
    }
  });
  
  window.dataLayer = { push: jest.fn() };

  manager.page();
  expect(window.dataLayer.push).toHaveBeenCalledWith({
    event: "pageview",
    page: "blank"
  });
});

it('handles the "setUserId" event', () => {
  const TagManager = require('../').default;
  
  const label = 'Something';
  const userId = 'abc123';
  const manager = TagManager({
    label,
    'google-tag-manager': {
      preloaded: true
    }
  });
  
  window.dataLayer = { push: jest.fn() };

  manager.setUserId(userId);
  expect(window.dataLayer.push).toHaveBeenCalledWith({ userId });
});

it('loads in google tag manager', () => {
  const configureGoogleTagManager = require('../google-tag-manager').default;
  expectLoadScriptToBeCalled(configureGoogleTagManager);
});

it('calls configureGoogleTagManager when config is set', () => {
  const configureGoogleTagManager = require('../google-tag-manager');
  configureGoogleTagManager.default = jest.fn();

  const TagManager = require('../').default;
  TagManager({
    label: 'Something',
    'google-tag-manager': {}
  });

  expect(configureGoogleTagManager.default).toBeCalled();
});
