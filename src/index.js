function IterArray (iterable) {
    if (typeof iterable === 'function') {
        iterable = iterable()
    }
    if (!isIterable(iterable)) {
        throw new Error(`${iterable} is not an iterable or iterator`)
    }
    const priv = {
        array: [],
        start: 0,
        end: Infinity
    }
    if (typeof iterable.length === 'number') {
        priv.array = iterable
        priv.end = iterable.length
    } else if (iterable instanceof IterArray) {
        return iterable
    } else {
        priv.iterator = typeof iterable.next === 'function'
            ? iterable
            : iterable[Symbol.iterator]()
    }
    return IterArrayConstructor(priv)
}

function IterArrayConstructor (priv) {
    return Object.create(IterArray.prototype, {
        slice: {
            value: sliceFactory(priv)
        },
        nth: {
            value: nthFactory(priv)
        },
        [Symbol.iterator]: {
            value: generatorFactory(priv)
        }
    })
}

function sliceFactory (priv) {
    return function (start, end) {
        start = Math.max(0, start)
        const newStart = priv.start + start
        return IterArrayConstructor({
            array: priv.array,
            start: newStart,
            end: newStart + (end - start),
            iterator: priv.iterator
        })
    }
}

function nthFactory (priv) {
    return function (n) {
        n += priv.start
        if (n >= priv.end) {
            return
        }
        const {array, iterator} = priv
        if (iterator) {
            while (n >= array.length && addToCache(priv)) {}
        }
        return array[n]
    }
}

function generatorFactory (private) {
    return function* () {
        const {array, start, end} = private
        const length = Math.min(array.length, end)
        let index
        for (index = Math.min(length, start); index < length; ++index) {
            yield array[index]
        }
        if (private.iterator) {
            for (; index < end; ++index) {
                if (!addToCache(private)) {
                    return
                }
                if (index >= start) {
                    yield array[index]
                }
            }
        }
    }
}

function addToCache (iterarray) {
    const {array} = iterarray
    const {done, value} = iterarray.iterator.next()
    if (done) {
        iterarray.end = array.length
        iterarray.iterator = null
        return false
    }
    return !!array.push(value)
}

function isIterable (iterable) {
    return iterable != null && typeof iterable[Symbol.iterator] === 'function'
}

module.exports = IterArray
