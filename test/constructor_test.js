const {expect} = require('chai')
const IterArray = require('../src/index.js')

describe('constructor', function () {
    describe('IterArray without new', function () {
        it('returns IterArray instance', function () {
            const iterArray = IterArray([1, 2])
            expect(iterArray).to.be.instanceOf(IterArray)
        })

        it('iterates the same values that iterable passed', function () {
            const array = [1, 2, 3]
            const set = new Set(array)
            const iterArray = IterArray(set)
            expect([...iterArray]).to.be.deep.equal(array)
        })
    })

    describe('IterArray with new', function () {
        it('returns IterArray instance', function () {
            const iterArray = new IterArray([1, 2])
            expect(iterArray).to.be.instanceOf(IterArray)
        })

        it('iterates the same values that iterable passed', function () {
            const array = [3, 2, 1]
            const iterArray = IterArray(array)
            expect([...iterArray]).to.be.deep.equal(array)
        })
    })
})
