import _ from 'lodash'

export default class Dispatcher {
  constructor(state) {
    this.handlers = {}
    this.actions = {}
    this.state = state
  }

  dispatch({key, payload}) {
    // todo. middleware?
    console.log(`called ${key}`)

    return this.handlers[key].call(this, ...payload)
  }

  route(key, handler) {
    if (_.isFunction(handler)) {
      console.log(`${key} is function`, handler)
      return this.routeFunction(key, handler)
    }

    if (_.isObject(handler)) {
      let proto = Object.getPrototypeOf(handler)

      console.log(`${key} is object: proto`, proto)

      if (proto) {
        console.log(`proto`, Object.getOwnPropertyNames(proto))
      }

      Object.getOwnPropertyNames(handler).forEach(method => {
        if (method[0] !== '_') {
          this.routeFunction(`${key}.${method}`, handler[method])
        }
      })

      return
    }

    console.log(handler)

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
