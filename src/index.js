function IterArray (iterable) {
    if (!(this instanceof IterArray)) {
        return new IterArray(iterable)
    }
    if (typeof iterable === 'function') {
        iterable = iterable()
    }
    if (!isIterable(iterable)) {
        return
    }
    let _array = []
    let _start = 0
    let _end = Infinity
    let _iterator
    if (typeof iterable.length === 'number') {
        _array = iterable
        _end = iterable.length
    } else if (iterable instanceof IterArray) {
        ({_array, _start, _end, _iterator} = iterable)
    } else {
        _iterator = typeof iterable.next === 'function'
            ? iterable
            : iterable[Symbol.iterator]()
    }
    Object.defineProperties(this, createProps(_array, _start, _end, _iterator))
}

Object.defineProperties(IterArray.prototype, {
    slice: {
        value (start, end) {
            const _start = Math.max(0, start)
            const props = createProps(
                this._array,
                this._start + _start,
                this._start + (end - start),
                this._iterator
            )
            return Object.create(IterArray.prototype, props)
        }
    },

    nth: {
        value (n) {
            n += this._start
            if (n >= this._end) {
                return
            }
            return nth(this, n)
        }
    },

    [Symbol.iterator]: {
        * value () {
            for (let index = this._start; index < this._end; ++index) {
                yield nth(this, index)
            }
        }
    }
})

function nth (iterarray, n) {
    const array = iterarray._array
    const iterator = iterarray._iterator
    if (iterator) {
        while (n >= array.length) {
            const {done, value} = iterator.next()
            if (done) {
                iterarray._end = array.length
                iterarray._iterator = null
                break
            }
            array.push(value)
        }
    }
    return array[n]
}

function isIterable (iterable) {
    return iterable != null && typeof iterable[Symbol.iterator] === 'function'
}

function createProps (array, start, end, iterator) {
    return {
        _array: {
            value: array
        },
        _start: {
            value: start
        },
        _end: {
            value: end,
            configurable: true
        },
        _iterator: {
            value: iterator,
            configurable: true
        }
    }
}

module.exports = IterArray
