const chai = require('chai')
const ObservableEvent = require('../../main/observable/ObservableEvent')

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

    it("throws for listeners that are not functions and does not add any listeners", function () {
        ( () => ob.sendTo(storeIn(listener1), "not a listener")).should.throw(Error)

        ob.send(42)
        listener1.values.should.eql([])
    })
})