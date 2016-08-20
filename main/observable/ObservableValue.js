const {ObservableBase} = require('./ObservableBase')

class ObservableValue extends ObservableBase {
    constructor(initialValue) {
        super()
        this._value = initialValue
    }

    get value() { return this._value }
    set value(data) {
        this._value = data
        this._notify(data)
    }

    sendTo(...listeners) {
        var listenerFns = super.sendTo(...listeners)
        if (this._value !== undefined) {
            listenerFns.forEach( l => l(this._value) )
        }
    }

}

module.exports = ObservableValue