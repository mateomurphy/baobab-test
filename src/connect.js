import React from 'react'

import {branch} from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

function bindActionCreator(actionCreator, tree) {
  return (...args) => actionCreator(tree, ...args)
}

// adapted from redux
function bindActionCreators(actionCreators, tree) {
  let keys = Object.keys(actionCreators)
  let boundActionCreators = {}

  keys.forEach(key => {
    let actionCreator = actionCreators[key]

    boundActionCreators[key] = bindActionCreator(actionCreator, tree)
  })

  return boundActionCreators
}

function displayName(Component) {
  return Component.name || Component.displayName || 'Component';
}

export default function connect(actions, cursors, Component) {
  const DispatchComponent = class extends React.Component {
    render() {
      const suppl = bindActionCreators(actions, this.context.tree);

      return <Component {...this.props} {...suppl} />;
    }
  }

  DispatchComponent.displayName = 'Dispatch' + displayName(Component)
  DispatchComponent.contextTypes = {
    tree: PropTypes.baobab
  };

  return branch(cursors, DispatchComponent)
}
