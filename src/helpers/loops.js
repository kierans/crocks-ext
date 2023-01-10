"use strict";

const constant = require("crocks/combinators/constant");
const curry = require("crocks/helpers/curry");
const unit = require("crocks/helpers/unit");

const { inc } = require("../math");
const { isLessThan } = require("../predicates");

/*
 * A function that loops around calling an action.
 */
// loop () -> a -> (a -> Boolean) -> (a -> a) -> (a -> Unit) -> Unit
const loop = curry((init, pred, update, fn) => {
	let count = init()

	while (pred(count)) {
		fn(count)
		count = update(count)
	}
});

/*
 * `collectLoop` iterates a number of times collecting the result of calling the
 * action function.
 */
// collectLoop :: Integer -> (Integer -> b) -> [ b ]
const collectLoop = curry((n, fn) => {
	const result = [];

	loop(
		constant(0),
		isLessThan(n),
		inc,
		(i) => unit(result.push(fn(i)))
	)

	return result;
})

/*
 * Maps an array using a loop.
 *
 * `mapLoop` will only iterate over the array `n` times. This allows only part
 * of a list to be mapped.
 */
// mapLoop :: Integer -> (a -> Integer -> b) -> [ a ] -> [ b ]
const mapLoop = curry((n, fn, arr) =>
	collectLoop(n, (i) => fn(arr[i], i))
)

module.exports = {
	collectLoop,
	loop,
	mapLoop
}
