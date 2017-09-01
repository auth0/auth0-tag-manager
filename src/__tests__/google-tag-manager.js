/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

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
