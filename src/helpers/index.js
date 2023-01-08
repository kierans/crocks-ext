"use strict";

const applyTo = require("crocks/combinators/applyTo");
const coalesce = require("crocks/pointfree/coalesce");
const compose = require("crocks/helpers/compose");
const composeK = require("crocks/helpers/composeK");
const concat = require("crocks/pointfree/concat");
const constant = require("crocks/combinators/constant");
const converge = require("crocks/combinators/converge");
const flip = require("crocks/combinators/flip");
const identity = require("crocks/combinators/identity");
const liftA2 = require("crocks/helpers/liftA2");
const map = require("crocks/pointfree/map");
const nAry = require("crocks/helpers/nAry");
const option = require("crocks/pointfree/option");
const pipe = require("crocks/helpers/pipe");
const tail = require("crocks/pointfree/tail");

const { getKeys, getValue, setValue, reduceToMap } = require("../Map");
const { inc } = require("../math");

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

// countItem :: Map a Integer -> a -> Map a Integer
const countItem = flip((key) =>
	converge(
		setValue(key),
		compose(inc, option(0), getValue(key)),
		identity,
	)
)

/*
 * We use a Map so that any value can be a key
 */
// countItems :: Foldable f => f a -> Map a Integer
const countItems = reduceToMap(countItem)

/*
 * Converts a 'Nothing' tail into a 'Just []'
 *
 * When concat'ing Maybe's if one is a Nothing, the result is a Nothing
 * which we may not want. This allows a Nothing tail to be an empty list.
 */
// emptyTail :: m a -> Maybe (m a)
const emptyTail = compose(coalesce(constant([]), identity), tail)

// length :: a -> Number
const length = (a) => a.length

const prepend = flip(concat);

/*
 * Filters a list of data for unique items
 */
// unique :: Foldable f => f a -> f a
const unique =
	compose(getKeys, countItems)

/*
 * Collects the arguments to a function into an array
 */
// zipArgs :: * -> [ * ]
const zipArgs = function() {
	/*
	 * Can't be an arrow function because of the way Node args work.
	 */
	return Array.prototype.slice.call(arguments)
}

module.exports = {
	applyFunctor,
	chainLiftA2,
	emptyTail,
	length,
	prepend,
	unique,
	zipArgs
}
