const ObservableValue = () => require('./ObservableValue')

function listenerFn(l) {

    if (l instanceof ObservableEvent) {
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

class ObservableEvent {
    constructor() {
        this._listeners = []
        this._latestEvent = undefined
    }

    get latestEvent() { return this._latestEvent }

    send(data) {
        this._latestEvent = data
        this._listeners.forEach( l => l(data) )
    }

    sendTo(...listeners) {
        this._listeners = this._listeners.concat( listeners.map(listenerFn))
    }

    sendFlatTo(...listeners) {
        this.sendTo(...listeners.map(listenerFn).map(this.flatListener))

    }

    flatListener(listener) {
        return (collection) => {
            collection.forEach( x => listener(x) )
        }
    }

}
module.exports = ObservableEvent



