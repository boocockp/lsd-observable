const {ObservableBase, listenerFn} = require('./ObservableBase')

class ObservableEvent extends ObservableBase {
    constructor() {
        super()
        this._latestEvent = undefined
    }

    get latestEvent() { return this._latestEvent }

    send(data) {
        this._latestEvent = data
        this._notify(data)
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



