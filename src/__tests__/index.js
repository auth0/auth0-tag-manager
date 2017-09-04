/* eslint-disable no-undef, new-cap */

import TagManager from '../';

const errors = {
  noConfigLabel: 'config.label is required.',
  noConfig: 'config is required.'
};

it('throws when no config is passed', () => {
  TagManager(null, (error) => {
    expect(error.message).toEqual(errors.noConfig);
  });
});

it('throws when no config.label is passed', () => {
  TagManager({}, (error) => {
    expect(error.message).toEqual(errors.noConfigLabel);
  });
});

it('doesn\'t call the callback if config is correct and there are no tags', () => {
  const callback = jest.fn();
  TagManager({ label: 'Something' }, callback);

  expect(callback).not.toBeCalled();
});

it('exposes page(), track() and setUserId()', () => {
  const manager = TagManager({ label: 'Something' });

  expect(typeof manager).toBe('object');
  expect(manager.length).toBeUndefined();
  expect(Object.keys(manager)).toHaveLength(3);
  expect(typeof manager.page).toEqual('function');
  expect(typeof manager.track).toEqual('function');
  expect(typeof manager.setUserId).toEqual('function');
});

