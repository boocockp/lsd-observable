const chai = require('chai')
const {ObservableValue, ObservableEvent} = require('../../main')

const should = chai.should()

describe("ObservableValue", function () {
    let listener1, listener2, ob

    beforeEach(function () {
        ob = new ObservableValue()
        listener1 = {values: []}
        listener2 = {values: []}
    })

    function storeIn(listener) {
        return function(value) {
            listener.values.push(value)
        }
    }

    it("can add listeners separately and sends initial value to them when value is not undefined", function () {
        ob = new ObservableValue(42)
        ob.sendTo(storeIn(listener1))
        ob.sendTo(storeIn(listener2))

        ob.value.should.eql(42)
        listener1.values.should.eql([42])
        listener2.values.should.eql([42])
    })

    it("sends no initial value to listeners when value is undefined", function () {
        ob.sendTo(storeIn(listener1), storeIn(listener2))

        should.not.exist(ob.value)
        listener1.values.should.eql([])
        listener2.values.should.eql([])
    })

    it("can add listeners together and stores subsequent values and sends to each listener", function () {
        ob.sendTo(storeIn(listener1), storeIn(listener2))

        ob.value = 33
        ob.value = 44

        ob.value.should.eql(44)
        listener1.values.should.eql([33, 44])
        listener2.values.should.eql([33, 44])
    })

    it("accepts ObservableEvent and ObservableValue as listeners", function () {
        const obValue = new ObservableValue()
        const obEvent = new ObservableEvent()

        ob.sendTo(obValue, obEvent)
        ob.value = 22
        ob.value = 33

        obValue.value.should.eql(33)
        obEvent.latestEvent.should.eql(33)
    })

    it("throws for listeners that are not functions and does not add any listeners", function () {
        ( () => ob.sendTo(storeIn(listener1), "not a listener")).should.throw(Error)

        ob.value = 42
        listener1.values.should.eql([])

    })

    it("stops sending", function () {
        const obValue = new ObservableValue()

        ob.sendTo(obValue)
        ob.value = 33

        obValue.value.should.eql(33)

        ob.stopSending()
        ob.value = 44

        obValue.value.should.eql(33)
    })

})