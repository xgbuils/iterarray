const {expect} = require('chai')
const IterArray = require('../src/index.js')

describe('length', function () {
    describe('String', function () {
        it('it returns the length of the string', function () {
            const string = 'abcd'
            const iterArray = IterArray(string)
            expect(iterArray.length).to.be.equal(string.length)
        })
    })

    describe('Set', function () {
        describe('no empty set', function () {
            let array
            let iterArray
            beforeEach(function () {
                array = [1, 2, 3, 4]
                const set = new Set(array)
                iterArray = IterArray(set)
            })
            it('it returns Infinity in a first instance', function () {
                expect(iterArray.length).to.be.equal(Infinity)
            })
            it('it returns Infinity when is get just the first value and iterarray is not empty', function () {
                iterArray.nth(0)
                expect(iterArray.length).to.be.equal(Infinity)
            })
            it('it returns Infinity when is get the last value and iterarray is not empty', function () {
                iterArray.nth(3)
                expect(iterArray.length).to.be.equal(Infinity)
            })
            it('it returns the length when is tried to get the an outer value with positive index', function () {
                iterArray.nth(4)
                expect(iterArray.length).to.be.equal(array.length)
            })
            it('it returns Infinity when is get the an outer value with negative index', function () {
                iterArray.nth(-2)
                expect(iterArray.length).to.be.equal(Infinity)
            })
        })

        describe('empty set', function () {
            let array
            let iterArray
            beforeEach(function () {
                array = []
                const set = new Set(array)
                iterArray = IterArray(set)
            })
            it('it returns Infinity in a first instance', function () {
                expect(iterArray.length).to.be.equal(Infinity)
            })
            it('it returns Infinity when is get just the first value', function () {
                iterArray.nth(0)
                expect(iterArray.length).to.be.equal(array.length)
            })
            it('it returns the length when is tried to get the an outer value with positive index', function () {
                iterArray.nth(4)
                expect(iterArray.length).to.be.equal(array.length)
            })
            it('it returns Infinity when is get the an outer value with negative index', function () {
                iterArray.nth(-2)
                expect(iterArray.length).to.be.equal(Infinity)
            })
        })
    })
})
