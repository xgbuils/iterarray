const keyCache = Symbol('cache')
const keyIterator = Symbol('iterator')
const keyStart = Symbol('start')
const keyEnd = Symbol('end')

function IterArray (iterable) {
    if (!(this instanceof IterArray)) {
        return new IterArray(iterable)
    }
    if (typeof iterable === 'function') {
        iterable = iterable()
    }
    this[keyCache] = []
    this[keyStart] = 0
    this[keyEnd] = Infinity
    if (iterable instanceof IterArray) {
        return iterable
    } else if (isIterator(iterable)) {
        this[keyIterator] = iterable
    } else if (isIterable(iterable)) {
        if (typeof iterable === 'string' || Array.isArray(iterable)) {
            this[keyCache] = iterable
            this[keyEnd] = iterable.length
        } else {
            this[keyIterator] = iterable[Symbol.iterator]()
        }
    } else {
        throw new Error(`${iterable} is not an iterable or iterator`)
    }
}

IterArray.factory = function (gen) {
    return (...args) => IterArray(gen(...args))
}

Object.defineProperties(IterArray.prototype, {
    slice: {
        value (start, end) {
            start = Math.max(0, start)
            const newStart = this[keyStart] + start
            const iterarray = Object.create(IterArray.prototype)
            iterarray[keyCache] = this[keyCache]
            iterarray[keyIterator] = this[keyIterator]
            iterarray[keyStart] = newStart
            iterarray[keyEnd] = newStart + (end - start)
            return iterarray
        }
    },
    nth: {
        value: nthFactory()
    },
    has: {
        value: nthFactory(true)
    },
    [Symbol.iterator]: {
        * value () {
            const cache = this[keyCache]
            const start = this[keyStart]
            const end = this[keyEnd]
            const length = Math.min(cache.length, end)
            let index
            for (index = Math.min(length, start); index < length; ++index) {
                yield cache[index]
            }
            if (this[keyIterator]) {
                for (; index < end; ++index) {
                    if (!addToCache(this)) {
                        return
                    }
                    if (index >= start) {
                        yield cache[index]
                    }
                }
            }
        }
    },
    length: {
        get () {
            return this[keyEnd]
        }
    }
})

function nthFactory (hasMethod) {
    return function (n) {
        n += this[keyStart]
        if (n < this[keyStart] || n >= this[keyEnd]) {
            return hasMethod && false
        }
        const cache = this[keyCache]
        if (this[keyIterator]) {
            while (n >= cache.length && addToCache(this)) {}
        }
        return hasMethod ? n < cache.length : cache[n]
    }
}

function addToCache (iterarray) {
    const cache = iterarray[keyCache]
    const {done, value} = iterarray[keyIterator].next()
    if (done) {
        iterarray[keyEnd] = cache.length
        iterarray[keyIterator] = null
        return false
    }
    return !!cache.push(value)
}

function isIterator (iterator) {
    return iterator != null && typeof iterator.next === 'function'
}

function isIterable (iterable) {
    return iterable != null && typeof iterable[Symbol.iterator] === 'function'
}

module.exports = IterArray
