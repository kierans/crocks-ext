"use strict";

const curry = require("crocks/helpers/curry");

// add :: Number -> Number -> Number
const add = curry((a, b) => a + b)

// inc :: Number -> Number
const inc = add(1)

module.exports = {
	add,
	inc
}
