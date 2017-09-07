/* eslint-disable no-undef */

import Deferred from '../defered';

it('queues functions when is not ready', () => {
  const def = new Deferred();
  const fun1 = jest.fn();
  const fun2 = jest.fn();

  def.push(fun1);
  def.push(fun2);

  expect(fun1).not.toBeCalled();
  expect(fun2).not.toBeCalled();
});

it('executes functions when is ready', () => {
  const def = new Deferred();
  const fun1 = jest.fn();
  const fun2 = jest.fn();

  def.run(() => true);

  def.push(fun1);
  def.push(fun2);

  expect(fun1).toBeCalled();
  expect(fun2).toBeCalled();
});

it('executes queued functions on run', () => {
  const def = new Deferred();
  const fun1 = jest.fn();
  const fun2 = jest.fn();

  def.push(fun1);
  def.push(fun2);

  def.run(() => true);

  expect(fun1).toBeCalled();
  expect(fun2).toBeCalled();
});

it("waits and sets a timeout for run() if it's not ready", () => {
  const def = new Deferred();

  expect(def.timeout).toBeUndefined();

  def.run(() => false);

  expect(typeof def.timeout).toEqual('number');
});
