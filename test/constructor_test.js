const {expect} = require('chai')
const IterArray = require('../src/index.js')

describe('constructor', function () {
    describe('IterArray without new', function () {
        it('returns IterArray instance', function () {
            const iterArray = IterArray([1, 2])
            expect(iterArray).to.be.instanceOf(IterArray)
        })
    })

    describe('IterArray with new', function () {
        it('returns IterArray instance', function () {
            const iterArray = new IterArray([1, 2])
            expect(iterArray).to.be.instanceOf(IterArray)
        })
    })

    describe('IterArray parameters', function () {
        it('iterates over the same values that set passed', function () {
            const array = [1, 2, 3]
            const set = new Set(array)
            const iterArray = new IterArray(set)
            expect([...iterArray]).to.be.deep.equal(array)
        })

        it('iterates over the same values that IterArray instance passed', function () {
            const array = [1, 2, 3]
            const firstIterArray = IterArray(array)
            const secondIterArray = IterArray(firstIterArray)
            expect([...secondIterArray]).to.be.deep.equal(array)
        })

        it('iterates over the same values that array passed', function () {
            const array = [3, 2, 1]
            const iterArray = new IterArray(array)
            expect([...iterArray]).to.be.deep.equal(array)
        })

        it('throws an exception if is not passed an iterable, iterator or function that returns an iterable or an iterator', function () {
            const param = 3
            function test () {
                IterArray(param)
            }
            expect(test).to.throw(`${param} is not an iterable or iterator`)
        })
    })
})
