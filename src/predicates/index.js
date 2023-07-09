"use strict";

const compose = require("crocks/helpers/compose");
const curry = require("crocks/helpers/curry");
const isSame = require("crocks/predicates/isSame");
const not = require("crocks/logic/not");

const { mod } = require("../math");

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

// isEven :: Number -> Boolean
const isEven = compose(isSame(0), mod(2));

// isOdd :: Number -> Boolean
const isOdd = not(isEven)

module.exports = {
	isEven,
	isGreaterThan,
	isGreaterThanEqualTo,
	isLessThan,
	isLessThanEqualTo,
	isOdd,
	matchesRegex
}
