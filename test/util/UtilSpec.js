const chai = require('chai')
const Util = require('../../main/util/Util')

describe("Util", function () {
    it("bindFunctions binds only public functions to this", function () {
        const obj = new class {
            constructor() { Util.bindFunctions(this) }
            get a() { return "a"}
            b(x) { this._b = x }
            _c(y) { this._cc = y }
        }

        const obj2 = {}

        obj.a.should.eql("a")

        obj.b("x1")
        obj._c("y1")
        obj._b.should.eql("x1")
        obj._cc.should.eql("y1")

        const function_b = obj.b, function_c = obj._c
        function_b.call(obj2, "x2")
        function_c.call(obj2, "y2")

        obj._b.should.eql("x2")
        obj._cc.should.eql("y1")
        obj2._cc.should.eql("y2")
    })

})