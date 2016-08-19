module.exports = class ObservableEvent {
    constructor() {
        this._listeners = []
        this._latestEvent = undefined
    }

    get latestEvent() { return this._latestEvent }

    send(data) {
        this._latestEvent = data
        this._listeners.map(l => l(data) )
    }

    sendTo(...listeners) {
        for( const l of listeners) {
            if (typeof l !== 'function') {
                throw new Error(`Observable listener must be a function, not ${l}`)
            }
        }
        for( const l of listeners) {
            this._listeners.push(l)
        }
    }

    sendFlatTo(...listeners) {
        this.sendTo(...listeners.map(this.flatListener))

    }

    flatListener(listener) {
        return function(collection) {
            collection.forEach( x => {
                listener(x)
                return true
            } )
        }
    }

}