function IterArray (iterable) {
    if (!(this instanceof IterArray)) {
        return new IterArray(iterable)
    }
    if (typeof iterable === 'function') {
        iterable = iterable()
    }
    if (!isIterable(iterable)) {
        throw new Error(`${iterable} is not an iterable or iterator`)
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
    Object.defineProperties(this, createProps({
        _array,
        _start,
        _end,
        _iterator
    }))
}

Object.defineProperties(IterArray.prototype, {
    slice: {
        value (start, end) {
            start = Math.max(0, start)
            const _start = this._start + start
            const props = createProps({
                _array: this._array,
                _start,
                _end: _start + (end - start),
                _iterator: this._iterator
            })
            return Object.create(IterArray.prototype, props)
        }
    },

    nth: {
        value (n) {
            n += this._start
            if (n >= this._end) {
                return
            }
            const array = this._array
            if (this._iterator) {
                while (n >= array.length && addToCache(this)) {}
            }
            return array[n]
        }
    },

    [Symbol.iterator]: {
        * value () {
            const {_array, _start, _end} = this
            const length = Math.min(_array.length, _end)
            let index
            for (index = Math.min(length, _start); index < length; ++index) {
                yield _array[index]
            }
            if (this._iterator) {
                for (; index < _end; ++index) {
                    if (!addToCache(this)) {
                        return
                    }
                    if (index >= _start) {
                        yield _array[index]
                    }
                }
            }
        }
    }
})

function addToCache (iterarray) {
    const array = iterarray._array
    const {done, value} = iterarray._iterator.next()
    if (done) {
        iterarray._end = array.length
        iterarray._iterator = null
        return false
    }
    return !!array.push(value)
}

function isIterable (iterable) {
    return iterable != null && typeof iterable[Symbol.iterator] === 'function'
}

function createProps (props) {
    const defProps = Object.keys(props).reduce((defProps, prop) => {
        return Object.assign(defProps, {
            [prop]: {
                value: props[prop]
            }
        })
    }, {})
    defProps._end.writable = true
    defProps._iterator.writable = true
    return defProps
}

module.exports = IterArray
