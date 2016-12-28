import React from 'react'
import Dispatcher from './Dispatcher'
import {branch as baobabBranch} from 'baobab-react/higher-order'
import BaobabPropTypes from 'baobab-react/prop-types'

function displayName(Component) {
  return Component.name || Component.displayName || 'Component'
}

export function root(dispatcher, Component) {
  const name = displayName(Component)

  const ComposedComponent = class extends React.Component {

    // Handling child context
    getChildContext() {
      return {
        dispatcher,
        tree: dispatcher.state
      };
    }

    // Render shim
    render() {
      return <Component {...this.props} />
    }
  };

  ComposedComponent.displayName = 'Rooted' + name;
  ComposedComponent.childContextTypes = {
    dispatcher: React.PropTypes.instanceOf(Dispatcher),
    tree: BaobabPropTypes.baobab
  };

  return ComposedComponent
}

export function branch(cursors, Component) {
  const DispatchComponent = class extends React.Component {
    render() {
      const suppl = this.context.dispatcher.actions;

      return <Component {...this.props} dispatch={this.context.dispatcher.dispatch} {...suppl} />;
    }
  }

  DispatchComponent.displayName = 'Dispatch' + displayName(Component)
  DispatchComponent.contextTypes = {
    dispatcher: React.PropTypes.instanceOf(Dispatcher)
  };

  return baobabBranch(cursors, DispatchComponent)
}
