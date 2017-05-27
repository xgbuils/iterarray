# IterArray

[![travis ci][1]][2]
[![npm version][3]][4]
[![Coverage Status][5]][6]
[![Dependency Status][7]][8]

`IterArray` is an iterable adapter that, given an iterable/generator or iterator, creates a new indexable lazy iterable. If iterable that is passed to the constructor is not indexable, the values are cached on the first traverse and, after, accessing to a value by index has constant cost.

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