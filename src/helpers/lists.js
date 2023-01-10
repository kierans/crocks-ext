"use strict";

const compose = require("crocks/helpers/compose");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const flip = require("crocks/combinators/flip");
const identity = require("crocks/combinators/identity");
const option = require("crocks/pointfree/option");

const { getKeys, getValue, reduceToMap, setValue } = require("../Map");
const { inc } = require("../math");

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

// length :: [ a ] -> Number
const length = (a) => a.length

// slice :: Integer -> Integer -> [ a ] -> [ a ]
const slice = curry((start, end, arr) =>
	arr.slice(start, end)
)

/*
 * Filters a list of data for unique items
 */
// unique :: Foldable f => f a -> [ a ]
const unique =
	compose(getKeys, countItems)

module.exports = {
	length,
	slice,
	unique
}
