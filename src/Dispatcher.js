import _ from 'lodash'
import isClass from 'is-class'

export default class Dispatcher {
  constructor(state) {
    this.handlers = {}
    this.actions = {}
    this.state = state
  }

  dispatch({key, payload}) {
    // todo. middleware?

    let parts = key.split('.')
    let method = parts.pop()
    let namespace = parts.join('.')

    if (_.isObject(this.handlers[namespace])) {
      return this.handlers[namespace][method](...payload)
    }

    return this.handlers[key].call(this, this.state, ...payload)
  }

  route(config = {}, namespace = null) {
    _.each(config, (handler, key) => {
      if (namespace) {
        key = `${namespace}.${key}`
      }

      if (_.isFunction(handler)) {
        if (isClass(handler)) {
          return this.routeClass(key, handler)
        }

        return this.routeFunction(key, handler)
      }

      if (_.isObject(handler)) {
        return this.route(handler, key)
      }
    })
  }

  routeClass(key, handler) {
    let instance = new handler(this.state)

    this.handlers[key] = instance

    Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(method => {
      if (method !== 'constructor') {
        this.makeAction(`${key}.${method}`)
      }
    })
  }

  routeFunction(key, handler) {
    this.handlers[key] = handler
    this.makeAction(key)
  }

  makeAction(key) {
    let parts = key.split('.')
    let method = parts.pop()
    let root = this.actions

    parts.forEach(part => {
      if (!root[part]) {
        root[part] = {}
      }

      root = root[part]
    })

    root[method] = (...payload) => {
      return this.dispatch({key, payload})
    }
  }
}
