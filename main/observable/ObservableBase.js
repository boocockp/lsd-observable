const ObservableEvent = () => require('./ObservableEvent')
const ObservableValue = () => require('./ObservableValue')

function listenerFn(l) {

    if (l instanceof ObservableEvent()) {
        return x => l.send(x)
    }
    if (l instanceof ObservableValue()) {
        return x => l.value = x
    }
    if (typeof l !== 'function') {
        throw new Error(`Observable listener must be a function, not ${l}`)
    }

    return l

}

class ObservableBase {
    constructor(initialValue) {
        this._listeners = []
    }

    _notify(data) {
        this._listeners.forEach(l => l(data) )
    }

    sendTo(...listeners) {
        const listenerFns = listeners.map(listenerFn)
        this._listeners = this._listeners.concat(listenerFns)
        return listenerFns
    }

    stopSending() {
        this._listeners = []
    }

}

module.exports = {ObservableBase, listenerFn}