"use strict";

const curry = require("crocks/helpers/curry");

// add :: Number -> Number -> Number
const add = curry((a, b) => a + b)

// inc :: Number -> Number
const inc = add(1)

// mod :: Number -> Number -> Number
const mod = curry((a, b) => b % a)

module.exports = {
	add,
	inc,
	mod
}
