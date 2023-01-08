"use strict";

const Pair = require("crocks/Pair");

const applyTo = require("crocks/combinators/applyTo");
const binary = require("crocks/helpers/binary");
const flip = require("crocks/combinators/flip");
const reduce = require("crocks/pointfree/reduce");

// apply :: (a -> b) -> a -> b
const apply = flip(applyTo)

/*
 * Converts an array of length 2 to a Pair
 */
// arrayToPair :: [ a, b ] -> Pair a b
const arrayToPair = function(arr) {
	if (arr.length !== 2) {
		throw new TypeError("arrayToPair: Array must be of length 2")
	}

	return reduce(binary(apply), binary(Pair), arr)
}

module.exports = {
	arrayToPair
}
