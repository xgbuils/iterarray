const {expect} = require('chai')
const IterArray = require('../src/index.js')

describe('nth', function () {
    describe('Array', function () {
        describe('empty', function () {
            let emptyArray
            let iterArray
            beforeEach(function () {
                emptyArray = []
                iterArray = new IterArray(emptyArray)
            })

            it('get index 0', function () {
                expect(iterArray.nth(0)).to.be.equal(undefined)
            })

            it('get negative index', function () {
                expect(iterArray.nth(-5)).to.be.equal(undefined)
            })

            it('get positive index', function () {
                expect(iterArray.nth(5)).to.be.equal(undefined)
            })
        })
        describe('no empty', function () {
            let array
            let iterArray
            beforeEach(function () {
                array = [1, 2, 3, 4]
                iterArray = new IterArray(array)
            })

            it('get index 0', function () {
                expect(iterArray.nth(0)).to.be.equal(array[0])
            })

            it('get negative index', function () {
                expect(iterArray.nth(-5)).to.be.equal(undefined)
            })

            it('get index less than length', function () {
                expect(iterArray.nth(array.length - 1)).to.be.equal(array.slice(-1)[0])
            })

            it('get index greater than length', function () {
                expect(iterArray.nth(array.length + 2)).to.be.equal(undefined)
            })

            it('get index equal to length', function () {
                expect(iterArray.nth(array.length)).to.be.equal(undefined)
            })
        })
    })

    describe('String', function () {
        describe('empty', function () {
            let emptyString
            let iterArray
            beforeEach(function () {
                emptyString = ''
                iterArray = new IterArray(emptyString)
            })

            it('get index 0', function () {
                expect(iterArray.nth(0)).to.be.equal(undefined)
            })

            it('get negative index', function () {
                expect(iterArray.nth(-5)).to.be.equal(undefined)
            })

            it('get positive index', function () {
                expect(iterArray.nth(5)).to.be.equal(undefined)
            })
        })
        describe('no empty', function () {
            let string
            let iterArray
            beforeEach(function () {
                string = '1234'
                iterArray = new IterArray(string)
            })

            it('get index 0', function () {
                expect(iterArray.nth(0)).to.be.equal(string[0])
            })

            it('get negative index', function () {
                expect(iterArray.nth(-5)).to.be.equal(undefined)
            })

            it('get index less than length', function () {
                expect(iterArray.nth(string.length - 1)).to.be.equal(string.slice(-1)[0])
            })

            it('get index greater than length', function () {
                expect(iterArray.nth(string.length + 2)).to.be.equal(undefined)
            })

            it('get index equal to length', function () {
                expect(iterArray.nth(string.length)).to.be.equal(undefined)
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

            it('get index 0', function () {
                expect(iterArray.nth(0)).to.be.equal(undefined)
            })

            it('get negative index', function () {
                expect(iterArray.nth(-5)).to.be.equal(undefined)
            })

            it('get positive index', function () {
                expect(iterArray.nth(5)).to.be.equal(undefined)
            })
        })
        describe('no empty', function () {
            let set
            let iterArray
            beforeEach(function () {
                set = new Set([1, 2, 3, 4])
                iterArray = new IterArray(set)
            })

            it('get index 0', function () {
                expect(iterArray.nth(0)).to.be.equal([...set][0])
            })

            it('get negative index', function () {
                expect(iterArray.nth(-5)).to.be.equal(undefined)
            })

            it('get index less than length', function () {
                expect(iterArray.nth(set.size - 1)).to.be.equal([...set].slice(-1)[0])
            })

            it('get index greater than length', function () {
                expect(iterArray.nth(set.size + 2)).to.be.equal(undefined)
            })

            it('get index equal to length', function () {
                expect(iterArray.nth(set.size)).to.be.equal(undefined)
            })
        })

        describe('call nth more than once', function () {
            let iterArray
            let n
            const a = 0
            const b = 2
            beforeEach(function () {
                n = 0
                iterArray = new IterArray(function* () {
                    for (let i = 0; i < Math.abs(2 * b) + 1; ++i) {
                        yield i
                        ++n
                        if (n > b) {
                            throw new Error('IterArray does not memoize!')
                        }
                    }
                })
            })

            it('get the same index twice', function () {
                const first = iterArray.nth(b)
                const second = iterArray.nth(b)
                expect(first).to.be.equal(second)
            })

            it('get first lower index than second index', function () {
                iterArray.nth(a)
                const second = iterArray.nth(b)
                expect(second).to.be.equal(b)
            })

            it('get first greater index than second index', function () {
                iterArray.nth(b)
                const second = iterArray.nth(a)
                expect(second).to.be.equal(a)
            })
        })
    })

    describe('calling nth to sliced IterArray', function () {
        it('get negative index of sliced IterArray', function () {
            const iterArray = IterArray([1, 2, 3, 4]).slice(1, 3)
            expect(iterArray.nth(-1)).to.be.equal(undefined)
        })

        it('get inner index of sliced IterArray', function () {
            const iterArray = IterArray([1, 2, 3, 4]).slice(1, 3)
            expect(iterArray.nth(0)).to.be.equal(2)
        })

        it('get outer index of sliced IterArray', function () {
            const iterArray = IterArray([1, 2, 3, 4]).slice(1, 3)
            expect(iterArray.nth(2)).to.be.equal(undefined)
        })
    })
})
