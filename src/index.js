function IterArray (iterable) {
    if (typeof iterable === 'function') {
        iterable = iterable()
    }
    const priv = {
        cache: [],
        start: 0,
        end: Infinity
    }
    if (iterable instanceof IterArray) {
        return iterable
    } else if (isIterator(iterable)) {
        priv.iterator = iterable
    } else if (isIterable(iterable)) {
        if (typeof iterable === 'string' || Array.isArray(iterable)) {
            priv.cache = iterable
            priv.end = iterable.length
        } else {
            priv.iterator = iterable[Symbol.iterator]()
        }
    } else {
        throw new Error(`${iterable} is not an iterable or iterator`)
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
            cache: priv.cache,
            start: newStart,
            end: newStart + (end - start),
            iterator: priv.iterator
        })
    }
}

function nthFactory (priv) {
    return function (n) {
        n += priv.start
        if (n < priv.start || n >= priv.end) {
            return
        }
        const {cache, iterator} = priv
        if (iterator) {
            while (n >= cache.length && addToCache(priv)) {}
        }
        return cache[n]
    }
}

function generatorFactory (private) {
    return function* () {
        const {cache, start, end} = private
        const length = Math.min(cache.length, end)
        let index
        for (index = Math.min(length, start); index < length; ++index) {
            yield cache[index]
        }
        if (private.iterator) {
            for (; index < end; ++index) {
                if (!addToCache(private)) {
                    return
                }
                if (index >= start) {
                    yield cache[index]
                }
            }
        }
    }
}

function addToCache (iterarray) {
    const {cache} = iterarray
    const {done, value} = iterarray.iterator.next()
    if (done) {
        iterarray.end = cache.length
        iterarray.iterator = null
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
