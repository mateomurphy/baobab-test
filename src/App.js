import React, {Component} from 'react'
import {root} from 'baobab-react/higher-order'
import Dispatcher from './Dispatcher'
import tree from './state'

import List from './components/List'

class Actions {
  test(payload) {
    return payload
  }
}

let actions = new Actions()

let test = function(payload) { return payload }
let tests = { test }

let dispatcher = new Dispatcher(tree)

//dispatcher.route('test', test)
dispatcher.route('tests', tests)
//dispatcher.route('test_class', Actions)
dispatcher.route('test_instance', actions)

//console.log(dispatcher.handlers)

//console.log(dispatcher.actions.test('hello'))
//console.log(dispatcher.actions.tests.test('bye'))

class App extends Component {
  render() {
    return <List />
  }
}

export default root(tree, App)
