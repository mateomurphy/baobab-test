import React, {Component} from 'react'
import {root} from './connectors.js'
import Dispatcher from './Dispatcher'
import tree from './state'

import List from './components/List'

let dispatcher = new Dispatcher(tree)

class App extends Component {
  render() {
    return <List />
  }
}

export default root(dispatcher, App)
