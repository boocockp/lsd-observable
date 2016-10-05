const chai = require('chai')
const {ObservableValue, ObservableEvent} = require('../../main')
const {List} = require('immutable')

const should = chai.should()

describe("ObservableEvent", function () {
    let listener1, listener2, ob

    beforeEach(function () {
        ob = new ObservableEvent()
        listener1 = {values: []}
        listener2 = {values: []}
    })

    function storeIn(listener) {
        return function(value) {
            listener.values.push(value)
        }
    }

    it("can add listeners separately and sends no initial value to them", function () {
        ob.sendTo(storeIn(listener1))
        ob.send(42)
        ob.sendTo(storeIn(listener2))
        ob.send(66)

        ob.latestEvent.should.eql(66)
        listener1.values.should.eql([42, 66])
        listener2.values.should.eql([66])
    })

    it("can add listeners together and stores subsequent values and sends to each listener", function () {
        ob.sendTo(storeIn(listener1), storeIn(listener2))

        ob.send(33)
        ob.send("Fred")

        ob.latestEvent.should.eql("Fred")
        listener1.values.should.eql([33, "Fred"])
        listener2.values.should.eql([33, "Fred"])
    })

    it("sends collections as one value to normal listeners and expanded to 'sendFlatTo' listeners", function () {
        ob.sendTo(storeIn(listener1))
        ob.sendFlatTo(storeIn(listener2))

        ob.send([22, 33])
        ob.send([44])
        ob.latestEvent.should.eql([44])
        listener1.values.should.eql([[22, 33], [44]])
        listener2.values.should.eql([22, 33, 44])
    })

    it("sends immutable collections as one value to normal listeners and expanded to 'sendFlatTo' listeners", function () {
        ob.sendTo(storeIn(listener1))
        ob.sendFlatTo(storeIn(listener2))

        const listA = List([22, 33])
        const listB = List([44])

        ob.send(listA)
        ob.send(listB)
        ob.latestEvent.should.eql(listB)
        listener1.values.should.eql([listA, listB])
        listener2.values.should.eql([22, 33, 44])
    })

    it("accepts ObservableEvent and ObservableValue as listeners", function () {
        const obValue = new ObservableValue()
        const obEvent = new ObservableEvent()

        ob.sendTo(obValue, obEvent)
        ob.send(22)
        ob.send(33)

        obValue.value.should.eql(33)
        obEvent.latestEvent.should.eql(33)
    })

    it("accepts ObservableEvent and ObservableValue as flat listeners", function () {
        const obValue = new ObservableValue()
        const obEvent = new ObservableEvent()

        ob.sendFlatTo(obValue, obEvent)
        ob.send([33])
        ob.send([33, 44])

        obValue.value.should.eql(44)
        obEvent.latestEvent.should.eql(44)
    })

    it("throws for listeners that are not functions and does not add any listeners", function () {
        ( () => ob.sendTo(storeIn(listener1), "not a listener")).should.throw(Error)

        ob.send(42)
        listener1.values.should.eql([])
    })

    it("stops sending", function () {
        const obEvent = new ObservableEvent()

        ob.sendTo(obEvent)
        ob.send(33)

        obEvent.latestEvent.should.eql(33)

        ob.stopSending()
        ob.send(44)

        obEvent.latestEvent.should.eql(33)
    })
})