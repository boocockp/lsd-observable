module.exports = class ObservableValue {
    constructor(initialValue) {
        this._listeners = []
        this._value = initialValue
    }

    get value() { return this._value }
    set value(data) {
        this._value = data
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
            if (this._value !== undefined) {
                l(this._value)
            }
        }
    }

}