import _ from 'lodash'
import Dispatcher from './Dispatcher'
import Controller from './Controller'
import state from './state'

let test = function(state, payload) {
  return payload
}

class Actions extends Controller {
  test(payload) {
    return payload
  }
}

const dispatcher = new Dispatcher({state})

dispatcher.route({
  test: test,
  tests: { test },
  test_class: Actions
})

it('contains handlers', () => {
  let result = _.keys(dispatcher.handlers)
  expect(result).toEqual(['test', 'tests.test', 'test_class'])
})

it('support functions', () => {
  let result = dispatcher.actions.test('foo')
  expect(result).toEqual('foo')
})

it('supports objects', () => {
  let result = dispatcher.actions.tests.test('bar')
  expect(result).toEqual('bar')
})

it('support es6 classes', () => {
  let result = dispatcher.actions.test_class.test('baz')
  expect(result).toEqual('baz')
})
