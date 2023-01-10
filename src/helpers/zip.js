"use strict";

const Min = require("crocks/Min");
const Pair = require("crocks/Pair");

const applyTo = require("crocks/combinators/applyTo");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const curry = require("crocks/helpers/curry");
const getPropOr = require("crocks/helpers/getPropOr");
const flip = require("crocks/combinators/flip");
const map = require("crocks/pointfree/map");
const mreduce = require("crocks/helpers/mreduce");
const nAry = require("crocks/helpers/nAry");
const reduce = require("crocks/pointfree/reduce");

const { arrayToTuple } = require("../Tuple");
const { length } = require("./lists");
const { collectLoop, mapLoop } = require("./loops");

// lookup :: [ a ] -> Integer -> a
const lookup =
	flip(getPropOr(undefined))

/*
 * Collects the arguments to a function into an array
 */
// zipArgs :: (*) -> [ * ]
const zipArgs = function() {
	/*
	 * Can't be an arrow function because of the way Node args work.
	 */
	return Array.prototype.slice.call(arguments)
}

/*
 * zipTo takes a n-arity producer function and a 2D array.
 *
 * It then applies the producer function to the n-th element of every child array, until
 * a final result is produced.
 *
 * The returned array is truncated to the length of the shortest of the child arrays.
 */
// zipTo :: ((*) -> b) -> [ [ a ] ] -> [ b ]
const zipTo = (fn) => (...arrs) => {
	const min = mreduce(Min, map(length, arrs));
	const collectors = collectLoop(min, constant(nAry(length(arrs), fn)))

	// applyCollector :: [ (*) -> b ] -> a -> Integer -> ((*) -> b | b)
	const applyCollector = curry((collectors, el) =>
		compose(applyTo(el), lookup(collectors))
	)

	return reduce(
		curry(compose(mapLoop(min), applyCollector)),
		collectors,
		arrs
	)
}

const zipToArray = zipTo(zipArgs)

const zipToPair = (...arrs) => {
	if (arrs.length !== 2) {
		throw new TypeError("zipToPair: requires two arrays");
	}

	return zipTo(curry(Pair))(...arrs);
}

const zipToTuple = compose(map(arrayToTuple), zipToArray)

module.exports = {
	zipArgs,
	zipToArray,
	zipToPair,
	zipToTuple
}
