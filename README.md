# IterArray

[![travis ci][1]][2]
[![npm version][3]][4]
[![Coverage Status][5]][6]
[![Dependency Status][7]][8]

`IterArray` is an iterable adapter that, given an iterable/generator or iterator, creates a new indexable lazy iterable that provides `nth` and `slice` methods.

Performance of IterArray instances are optimized for `Array` and primitive string iterables.

## Usage.


``` javascript
const iterable = IterArray(new Set([5, 2, 8, 3, 4, 0, 9]))

iterable.nth(2) // 8
const slicedIterable = iterable.slice(1, 4) // IterArray([2, 8, 3])
slicedIterable.nth(2) // 3
;[...slicedIterable] // [2, 8, 3]

for (const x of iterable) {
    console.log(x) // log 5 2 8 3 4 0 9
}

for (const x of slicedIterable) {
    console.log(x) // log 2 8 3
}
```

## API

### constructor (iterable)

It creates a `IterArray` instance that iterates over the same values as `iterable` parameter or if `iterable` is a function, then it iterates over the same values as `iterable()`. It throws an exception if it is not passed an iterable, iterator or function that returns an iterable or an iterator.

#### Example:

``` javascript
const IterArray = require('iterarray')

function* gen () {
  yield 1
  yield 2
  yield 4
  yield 8
}

const iterableByArray = IterArray([1, 2, 3])
;[...iterableByArray] // [1, 2, 3]
const iterableBySet = IterArray(new Set([4, 5, 6]))
;[...iterableBySet] // [4, 5, 6]
const iterableByIterArray = IterArray(iterableByArray)
;[...iterableByIterArray] // [1, 2, 3]
const iterableByGenerator = IterArray(gen)
;[...iterableByGenerator] // [1, 2, 4, 8]
const iterableByIterator = IterArray(gen())
;[...iterableByIterator] // [1, 2, 4, 8]
const iterableByFunction = IterArray(() => iterableBySet)
;[...iterableByFunction] // [4, 5, 6]
```

### nth (index)
It returns the `index`-th value that produces IterArray instance.

Internally, when `.nth(index)` is called, the values between 0 and index are cached. Then, if it is called `nth` with a lower index, no values are computed and if it is called with a greater index, only the values between `index + 1` and the greater index are computed.

#### Example:
``` javascript
const IterArray = require('iterarray')

const iterable = IterArray([2, 5, 3, 7, 6, 1, 9, 4])
iterable.nth(2) // 3
iterable.nth(6) // 9
iterable.nth(0) // 2
iterable.nth(-5) // undefined
iterable.nth(10) // undefined

```

### has (index)
It returns true if IterArray instance produces the `index`-th value.

#### Example:
``` javascript
const IterArray = require('iterarray')

const iterable = IterArray([2, 5, 3, 7, 6, 1, 9, 4])
iterable.has(0) // true
iterable.has(5) // true
iterable.nth(2) // true
iterable.nth(-5) // false
iterable.nth(21) // false

```

### slice (start, end)

It returns an IterArray instance that iterates over the same values as sliced iterable.

Internally, the `slice` method does not slice the iterable, it just define a new iterable that iterates over sliced values (lazy evaluation). The sliced values of `IterArray` instance are also cached to get better performance when it called more than once.

### length

A property of IterArray instance that can be an integer positive number or `Infinity`. The `length` property can be determined with a finite number only if all of the values of IterArray instance are cached. 

In general, while not all of the values of iterable are traversed, `length` property is Infinity. However `IterArray` makes optimizations for arrays and primitive strings caching the values when the IterArray instance is created. Then, `length` is a finite number in a first instance. 

#### Example:
``` javascript
const a = IterArray(new Set([1, 2]))
a.length // Infinity
a.nth(0) // 1
a.length // Infinity
a.nth(1) // 2
a.length // Infinity
a.nth(2) // undefined
a.length // 2

const b = IterArray(new Set([1, 2]))
b.length // Infinity
;[...b] // [1, 2]
b.length // 2

const c = IterArray([1, 2])
c.length // 2

const d = IterArray('abc')
c.length // 3
```

## LICENSE
MIT

  [1]: https://travis-ci.org/xgbuils/iterarray.svg?branch=master
  [2]: https://travis-ci.org/xgbuils/iterarray
  [3]: https://badge.fury.io/js/iterarray.svg
  [4]: https://badge.fury.io/js/iterarray
  [5]: https://coveralls.io/repos/github/xgbuils/iterarray/badge.svg?branch=master
  [6]: https://coveralls.io/github/xgbuils/iterarray?branch=master
  [7]: https://david-dm.org/xgbuils/iterarray.svg
  [8]: https://david-dm.org/xgbuils/iterarray