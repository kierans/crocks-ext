"use strict";

const applyTo = require("crocks/combinators/applyTo");
const composeK = require("crocks/helpers/composeK");
const flip = require("crocks/combinators/flip");
const identity = require("crocks/combinators/identity");
const liftA2 = require("crocks/helpers/liftA2");
const map = require("crocks/pointfree/map");
const nAry = require("crocks/helpers/nAry");
const pipe = require("crocks/helpers/pipe");

/*
 * While `map` is very handy in that it will take a function and apply it to a value, what
 * happens when we want to take an array of functions and apply them to a value?
 *
 * Because Array is a Functor (as it has a `map` method) we can take the array and apply it
 * to a given value returning a new array with the results.
 *
 * `applyFunctor` can be used with any Functor without needing the Functor to be an Applicative
 * or needing to lift the value into a Functor first; as is needed when applying an Applicative
 * to a value.
 */
// applyFunctor :: Functor f => f (a -> b) -> a -> f b
const applyFunctor = flip(pipe(applyTo, map));

/*
 * Useful when the result of a liftA2 returns a Monad, so that we can fold out the inner Monad.
 */
// chainLiftA2 :: Applicative m => (a -> b -> m c) -> m a -> m b -> m c
const chainLiftA2 = nAry(3, composeK(identity, liftA2))

module.exports = {
	applyFunctor,
	chainLiftA2
}
