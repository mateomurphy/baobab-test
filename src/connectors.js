import React from 'react'
import Baobab from 'baobab';
import Dispatcher from './Dispatcher'

const makeError = Baobab.helpers.makeError

const dispatcherShape = (props, propName) => {
  console.log(props, propName)

  if (!(propName in props)) {
    return
  }

  if (!(props[propName] instanceof Dispatcher)) {
    return new Error('Not a Dispatcher')
  }
}

function displayName(Component) {
  return Component.name || Component.displayName || 'Component';
}

/**
 * Solving the mapping given to a higher-order construct.
 */
function solveMapping(mapping, props, context) {
  if (typeof mapping === 'function')
    mapping = mapping(props, context);

  return mapping;
}

function invalidMapping(name, mapping) {
  throw makeError(
    'baobab-react/higher-order.branch: given cursors mapping is invalid (check the "' + name + '" component).',
    {mapping}
  );
}


/**
 * Root component
 */
export function root(dispatcher, Component) {
  const name = displayName(Component);

  const ComposedComponent = class extends React.Component {

    // Handling child context
    getChildContext() {
      return {
        dispatcher
      };
    }

    // Render shim
    render() {
      return <Component {...this.props} />;
    }
  };

  ComposedComponent.displayName = 'Rooted' + name;
  ComposedComponent.childContextTypes = {
    dispatcher: dispatcherShape
  };

  return ComposedComponent;
}


export function branch(cursors, Component) {

  const name = displayName(Component);

  const ComposedComponent = class extends React.Component {

    getDecoratedComponentInstance() {
        return this.decoratedComponentInstance;
    }

    handleChildRef(component) {
        this.decoratedComponentInstance = component;
    }

    // Building initial state
    constructor(props, context) {
      super(props, context);

      if (cursors) {
        const mapping = solveMapping(cursors, props, context);

        if (!mapping)
          invalidMapping(name, mapping);

        // Creating the watcher
        this.watcher = this.context.tree.watch(mapping);

        // Hydrating initial state
        this.state = this.watcher.get();
      }
    }

    // On component mount
    componentWillMount() {

      // Creating dispatcher
      this.dispatcher = (fn, ...args) => fn(this.context.tree, ...args);

      if (!this.watcher)
        return;

      const handler = () => {
        if (this.watcher)
          this.setState(this.watcher.get());
      };

      this.watcher.on('update', handler);
    }

    // Render shim
    render() {
      const suppl = {dispatch: this.dispatcher};

      return <Component {...this.props} {...suppl} {...this.state} ref={this.handleChildRef.bind(this)} />;
    }

    // On component unmount
    componentWillUnmount() {
      if (!this.watcher)
        return;

      // Releasing watcher
      this.watcher.release();
      this.watcher = null;
    }

    // On new props
    componentWillReceiveProps(props) {
      if (!this.watcher || typeof cursors !== 'function')
        return;

      const mapping = solveMapping(cursors, props, this.context);

      if (!mapping)
        invalidMapping(name, mapping);

      // Refreshing the watcher
      this.watcher.refresh(mapping);
      this.setState(this.watcher.get());
    }
  };

  ComposedComponent.displayName = 'Branched' + name;
  ComposedComponent.contextTypes = {
    tree: dispatcherShape
  };

  return ComposedComponent;
}