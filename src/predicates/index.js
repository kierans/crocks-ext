"use strict";

const curry = require("crocks/helpers/curry");

// isGreaterThan :: Number -> Number -> Boolean
const isGreaterThan = curry((a, b) => b > a)

// isGreaterThanEqualTo :: Number -> Number -> Boolean
const isGreaterThanEqualTo = curry((a, b) => b >= a)

// isLessThan :: Number -> Number -> Boolean
const isLessThan = curry((a, b) => b < a)

// isLessThanEqualTo :: Number -> Number -> Boolean
const isLessThanEqualTo = curry((a, b) => b <= a)

// matchesRegex :: RegExp -> String -> Boolean
const matchesRegex = curry((regexp, str) => regexp.test(str))

module.exports = {
	isGreaterThan,
	isGreaterThanEqualTo,
	isLessThan,
	isLessThanEqualTo,
	matchesRegex
}
