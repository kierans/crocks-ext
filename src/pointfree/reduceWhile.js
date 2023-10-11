"use strict";

const applyTo = require("crocks/combinators/applyTo");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const head = require("crocks/pointfree/head");
const ifElse = require("crocks/logic/ifElse");
const option = require("crocks/pointfree/option");
const map = require("crocks/pointfree/map");
const nAry = require("crocks/helpers/nAry");
const tail = require("crocks/pointfree/tail");

// trinary :: a -> b -> c -> d
const trinary = nAry(3);

// rest :: Foldable f => f a -> f a
const rest = compose(option([]), tail)

// ifHead :: Functor m => (b -> Boolean) -> (b -> (f b -> a) -> (b -> (f b -> a)) -> m b -> m (f b -> a)
const ifHead = trinary(compose(map, ifElse))

// reduceHead :: Foldable f => (b -> Boolean) -> (b -> (f b -> a) -> (f b -> a) -> f b -> (f b -> a)
const reduceHead = curry((pred, ifTrue, ifFalse) =>
	compose(option(ifFalse), ifHead(pred, ifTrue, constant(ifFalse)), head)
)

/*
 * `reduceWhile` reduces a list as long as the predicate function holds true.
 *
 * Due to the predicate function being curried, if the predicate is only interested in the
 * accumulator, it should return a function wrapping the test so that the item is ignored.
 * Alternatively, if the predicate is only interested in testing the item, have a factory
 * function that ignores the accumulator and returns the predicate function for the item.
 */
// reduceWhile :: Foldable f => (a -> b -> Boolean) -> (a -> b -> a) -> a -> f b -> a
const reduceWhile = curry((pred, f, acc) =>
	converge(
		/*
		 * We want to apply the function to the entire array.
		 * Using `map` would see the array mapped over.
		 */
		applyTo,
		rest,
		reduceHead(pred(acc), compose(reduceWhile(pred, f), f(acc)), constant(acc))
	)
)

module.exports = {
	reduceWhile
}
