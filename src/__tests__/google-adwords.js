/* eslint-disable no-undef, new-cap */

import { expectLoadScriptToBeCalled } from '../test-utils';

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
