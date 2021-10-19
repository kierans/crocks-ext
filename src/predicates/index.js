"use strict";

const curry = require("crocks/helpers/curry");

// matchesRegex :: RegExp -> String -> Boolean
const matchesRegex = curry((regexp, str) => regexp.test(str))

module.exports = {
	matchesRegex
}
