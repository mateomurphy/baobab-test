import React, {Component} from 'react'
import {root} from './connectors.js'
import Dispatcher from './Dispatcher'
import tree from './state'
import * as actions from './actions'
import List from './components/List'

let dispatcher = new Dispatcher(tree)
dispatcher.route(actions)

class App extends Component {
  render() {
    return <List />
  }
}

export default root(dispatcher, App)
