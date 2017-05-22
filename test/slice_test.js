const {expect} = require('chai')
const IterArray = require('../src/index.js')

describe('slice', function () {
    describe('Array', function () {
        describe('empty', function () {
            let emptyArray
            let iterArray
            beforeEach(function () {
                emptyArray = []
                iterArray = new IterArray(emptyArray)
            })

            it('positive slice', function () {
                const slice = iterArray.slice(1, 3)
                expect([...slice]).to.be.deep.equal([])
            })

            it('negative slice', function () {
                const slice = iterArray.slice(-4, 0)
                expect([...slice]).to.be.deep.equal([])
            })

            it('mixed slice', function () {
                const slice = iterArray.slice(-4, 3)
                expect([...slice]).to.be.deep.equal([])
            })

            it('start greater than end', function () {
                const slice = iterArray.slice(3, 1)
                expect([...slice]).to.be.deep.equal([])
            })

            it('start equal to end', function () {
                const slice = iterArray.slice(1, 1)
                expect([...slice]).to.be.deep.equal([])
            })
        })

        describe('no empty', function () {
            let array
            let iterArray
            beforeEach(function () {
                array = [1, 2, 3, 4]
                iterArray = new IterArray(array)
            })

            it('positive slice', function () {
                const slice = iterArray.slice(1, 3)
                expect([...slice]).to.be.deep.equal([2, 3])
            })

            it('negative slice', function () {
                const slice = iterArray.slice(-4, 0)
                expect([...slice]).to.be.deep.equal([])
            })

            it('mixed slice', function () {
                const slice = iterArray.slice(-4, 3)
                expect([...slice]).to.be.deep.equal([1, 2, 3])
            })

            it('start greater than end', function () {
                const slice = iterArray.slice(3, 1)
                expect([...slice]).to.be.deep.equal([])
            })

            it('start equal to end', function () {
                const slice = iterArray.slice(1, 1)
                expect([...slice]).to.be.deep.equal([])
            })
        })
    })

    describe('Map', function () {
        describe('empty', function () {
            let emptyMap
            let iterArray
            beforeEach(function () {
                emptyMap = new Map()
                iterArray = new IterArray(emptyMap)
            })

            it('positive slice', function () {
                const slice = iterArray.slice(1, 3)
                expect([...slice]).to.be.deep.equal([])
            })

            it('negative slice', function () {
                const slice = iterArray.slice(-4, 0)
                expect([...slice]).to.be.deep.equal([])
            })

            it('mixed slice', function () {
                const slice = iterArray.slice(-4, 3)
                expect([...slice]).to.be.deep.equal([])
            })

            it('start greater than end', function () {
                const slice = iterArray.slice(3, 1)
                expect([...slice]).to.be.deep.equal([])
            })

            it('start equal to end', function () {
                const slice = iterArray.slice(1, 1)
                expect([...slice]).to.be.deep.equal([])
            })
        })

        describe('no empty', function () {
            let array
            let map
            let iterArray
            beforeEach(function () {
                array = [
                    ['one', 1],
                    ['two', 2],
                    ['three', 3],
                    ['four', 4]
                ]
                map = new Map(array)
                iterArray = new IterArray(map)
            })

            it('positive slice', function () {
                const slice = iterArray.slice(1, 3)
                expect([...slice]).to.be.deep.equal(array.slice(1, 3))
            })

            it('negative slice', function () {
                const slice = iterArray.slice(-4, 0)
                expect([...slice]).to.be.deep.equal([])
            })

            it('mixed slice', function () {
                const slice = iterArray.slice(-4, 3)
                expect([...slice]).to.be.deep.equal(array.slice(0, 3))
            })

            it('start greater than end', function () {
                const slice = iterArray.slice(3, 1)
                expect([...slice]).to.be.deep.equal([])
            })

            it('start equal to end', function () {
                const slice = iterArray.slice(1, 1)
                expect([...slice]).to.be.deep.equal([])
            })
        })

        describe('multiple calls', function () {
            let array
            function throwAt (array, n) {
                return new IterArray(function* () {
                    for (const val of array) {
                        yield val
                        --n
                        if (n <= 0) {
                            throw Error('not enough memoization')
                        }
                    }
                })
            }
            beforeEach(function () {
                array = ['i', 'ii', 'iii', 'iv']
            })

            it('first slice bigger than second', function () {
                const iterArray = throwAt(array, 4)
                const first = iterArray.slice(1, 3)
                const second = iterArray.slice(0, 4)
                expect([...first]).to.be.deep.equal(array.slice(1, 3))
                expect([...second]).to.be.deep.equal(array.slice(0, 4))
            })

            it('first slice smaller than second', function () {
                const iterArray = throwAt(array, 3)
                const first = iterArray.slice(1, 3)
                const second = iterArray.slice(2, 3)
                expect([...first]).to.be.deep.equal(array.slice(1, 3))
                expect([...second]).to.be.deep.equal(array.slice(2, 3))
            })

            it('first slice equal to second', function () {
                const iterArray = throwAt(array, 4)
                const first = iterArray.slice(2, 4)
                const second = iterArray.slice(2, 4)
                expect([...first]).to.be.deep.equal(array.slice(2, 4))
                expect([...second]).to.be.deep.equal(array.slice(2, 4))
            })

            it('first slice intersects right with second', function () {
                const iterArray = throwAt(array, 3)
                const first = iterArray.slice(0, 2)
                const second = iterArray.slice(1, 3)
                expect([...first]).to.be.deep.equal(array.slice(0, 2))
                expect([...second]).to.be.deep.equal(array.slice(1, 3))
            })

            it('first slice intersects left with second', function () {
                const iterArray = throwAt(array, 4)
                const first = iterArray.slice(1, 4)
                const second = iterArray.slice(0, 3)
                expect([...first]).to.be.deep.equal(array.slice(1, 4))
                expect([...second]).to.be.deep.equal(array.slice(0, 3))
            })

            it('first and second slices are disjoint', function () {
                const iterArray = throwAt(array, 3)
                const first = iterArray.slice(1, 2)
                const second = iterArray.slice(2, 3)
                expect([...first]).to.be.deep.equal(array.slice(1, 2))
                expect([...second]).to.be.deep.equal(array.slice(2, 3))
            })

            it('slice does not compute values until iteration is required', function () {
                const iterArray = throwAt(array, 1)
                iterArray.slice(0, 4)
                const second = iterArray.slice(0, 1)
                expect([...second]).to.be.deep.equal(array.slice(0, 1))
            })
        })
    })
})
