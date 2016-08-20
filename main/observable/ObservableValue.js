const ObservableEvent = require('./ObservableEvent')

function listenerFn(l) {

    if (l instanceof ObservableEvent) {
        return x => l.send(x)
    }
    if (l instanceof ObservableValue) {
        return x => l.value = x
    }
    if (typeof l !== 'function') {
        throw new Error(`Observable listener must be a function, not ${l}`)
    }

    return l

}

class ObservableValue {
    constructor(initialValue) {
        this._listeners = []
        this._value = initialValue
    }

    get value() { return this._value }
    set value(data) {
        this._value = data
        this._listeners.forEach(l => l(data) )
    }

    sendTo(...listeners) {
        const listenerFns = listeners.map(listenerFn)
        this._listeners = this._listeners.concat(listenerFns)
        for( const l of listenerFns) {
            if (this._value !== undefined) {
                l(this._value)
            }
        }
    }

}

module.exports = ObservableValue