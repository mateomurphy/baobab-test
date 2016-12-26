import React, {Component} from 'react'
import {root} from 'baobab-react/higher-order'
import Dispatcher from './Dispatcher'
import tree from './state'

import List from './components/List'

class Controller {
  constructor(state) {
    this.state = state
  }
}

class Actions extends Controller {
  test(payload) {
    return payload
  }
}

let test = function(payload) { return payload }
let tests = { test }

let dispatcher = new Dispatcher(tree)

dispatcher.route('test', test)
dispatcher.route('tests', tests)
dispatcher.route('test_class', Actions)

//console.log(dispatcher.actions)

//console.log(dispatcher.actions.test('hello'))
//console.log(dispatcher.actions.tests.test('bye'))
dispatcher.actions.test_class.test('good!')


class App extends Component {
  render() {
    return <List />
  }
}

export default root(tree, App)
