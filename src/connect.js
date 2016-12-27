import React from 'react'

import {branch} from 'baobab-react/higher-order'

function displayName(Component) {
  return Component.name || Component.displayName || 'Component';
}

export default function connect(cursors, Component) {
  const DispatchComponent = class extends React.Component {
    render() {
      const suppl = this.context.dispatcher.actions;

      return <Component {...this.props} dispatch={this.context.dispatcher.dispatch} {...suppl} />;
    }
  }

  DispatchComponent.displayName = 'Dispatch' + displayName(Component)
  DispatchComponent.contextTypes = {
    dispatcher: React.PropTypes.object
  };

  return branch(cursors, DispatchComponent)
}
