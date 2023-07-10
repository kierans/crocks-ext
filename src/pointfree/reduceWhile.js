"use strict";

const applyTo = require("crocks/combinators/applyTo");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const curry = require("crocks/helpers/curry");
const fanout = require("crocks/Pair/fanout");
const head = require("crocks/pointfree/head");
const ifElse = require("crocks/logic/ifElse");
const option = require("crocks/pointfree/option");
const pipe = require("crocks/helpers/pipe");
const map = require("crocks/pointfree/map");
const merge = require("crocks/pointfree/merge");
const tail = require("crocks/pointfree/tail");

// rest :: Foldable f => f a -> f a
const rest = compose(option([]), tail)

// reduceHead :: Foldable f => (a -> Boolean) -> (a -> (f a -> b)) -> (a -> (f a -> b)) -> f a -> (f a -> b)
const reduceHead = curry((pred, ifTrue, ifFalse) =>
	compose(option(ifFalse), map(ifElse(pred, ifTrue, constant(ifFalse))), head)
)

/*
 * `reduceWhile` reduces a list as long as the predicate function holds true.
 *
 * Due to the predicate function being curried, if the predicate is only interested in the
 * accumulator, it should return a function wrapping the test do that the item is ignored.
 * Alternatively, if the predicate is only interested in testing the item, have a factory
 * function that ignores the accumulator and returns the real predicate function.
 */
// reduceWhile :: Foldable f => (a -> b -> Boolean) -> (a -> b -> a) -> a -> f b -> a
const reduceWhile = curry((pred, f, acc) =>
	pipe(
		fanout(rest, reduceHead(pred(acc), compose(reduceWhile(pred, f), f(acc)), constant(acc))),
		merge(applyTo)
	)
)

module.exports = {
	reduceWhile
}
