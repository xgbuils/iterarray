const {expect} = require('chai')
const IterArray = require('../src/index.js')

describe('has', function () {
    describe('Array', function () {
        describe('empty', function () {
            let emptyArray
            let iterArray
            beforeEach(function () {
                emptyArray = []
                iterArray = new IterArray(emptyArray)
            })

            it('has index 0', function () {
                expect(iterArray.has(0)).to.be.equal(false)
            })

            it('has not negative index', function () {
                expect(iterArray.has(-5)).to.be.equal(false)
            })

            it('has not positive index', function () {
                expect(iterArray.has(5)).to.be.equal(false)
            })
        })
        describe('no empty', function () {
            let array
            let iterArray
            beforeEach(function () {
                array = [1, 2, 3, 4]
                iterArray = new IterArray(array)
            })

            it('has index 0', function () {
                expect(iterArray.has(0)).to.be.equal(true)
            })

            it('has not negative index', function () {
                expect(iterArray.has(-5)).to.be.equal(false)
            })

            it('has index less than length', function () {
                expect(iterArray.has(array.length - 1)).to.be.equal(true)
            })

            it('has not index greater than length', function () {
                expect(iterArray.has(array.length + 2)).to.be.equal(false)
            })

            it('has not index equal to length', function () {
                expect(iterArray.has(array.length)).to.be.equal(false)
            })
        })
    })

    describe('Set', function () {
        describe('empty', function () {
            let emptySet
            let iterArray
            beforeEach(function () {
                emptySet = ''
                iterArray = new IterArray(emptySet)
            })

            it('has not index 0', function () {
                expect(iterArray.has(0)).to.be.equal(false)
            })

            it('has not negative index', function () {
                expect(iterArray.has(-5)).to.be.equal(false)
            })

            it('has not positive index', function () {
                expect(iterArray.has(5)).to.be.equal(false)
            })
        })
        describe('no empty', function () {
            let set
            let iterArray
            beforeEach(function () {
                set = new Set([1, 2, 3, 4])
                iterArray = new IterArray(set)
            })

            it('has index 0', function () {
                expect(iterArray.has(0)).to.be.equal(true)
            })

            it('has not negative index', function () {
                expect(iterArray.has(-5)).to.be.equal(false)
            })

            it('has index less than length', function () {
                expect(iterArray.has(set.size - 1)).to.be.equal(true)
            })

            it('has not index greater than length', function () {
                expect(iterArray.has(set.size + 2)).to.be.equal(false)
            })

            it('has not index equal to length', function () {
                expect(iterArray.has(set.size)).to.be.equal(false)
            })
        })
    })
})
