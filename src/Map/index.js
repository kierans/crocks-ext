"use strict";

const applyTo = require("crocks/combinators/applyTo");
const binary = require("crocks/helpers/binary");
const compose = require("crocks/helpers/compose");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const fst = require("crocks/Pair/fst");
const isDefined = require("crocks/predicates/isDefined");
const map = require("crocks/pointfree/map");
const reduce = require("crocks/pointfree/reduce");
const safe = require("crocks/Maybe/safe");
const snd = require("crocks/Pair/snd");

const { arrayToPair } = require("../Pair");

/*
 * Calls the Map's `get` method. Offers no safety.
 *
 * Use `getValue` to get a safe version of `get`
 */
// get :: Map a b -> a -> b | undefined
const get = curry((m, key) =>
	m.get(key)
)

/*
 * Calls the Map's `get` method.
 *
 * This mutates the Map and should only be used
 * where the mutation can be controlled as mutating
 * the Map may lead to a function being impure and
 * unintended (pass by reference) side effects.
 */
// set :: Map a b -> a -> b -> Map a b
const set = curry((m, key, value) =>
	m.set(key, value)
)

/*
 * Modifies a Map with the contents of a Pair.
 */
// modify :: Map a b -> Pair a b -> Map a b
const modify = curry((m) =>
	converge(set(m), fst, snd)
)

// collect :: Iterator a -> [ a ]
const collect = (i) => [...i]

/*
 * Reduce a list of things to a Map
 */
// reduceToMap :: (Map a b -> c -> Map a b) -> [ c ] -> Map a b
const reduceToMap = curry((fn, f) =>
	// needs to be function so that a new Map is created
	reduce(binary(fn), new Map(), f)
)

// getEntries :: Map a b -> [ Pair a b ]
const getEntries = (m) =>
	map(arrayToPair, collect(m.entries()))

/*
 * Creates a Map from a list of Pairs.
 *
 * This is optimized to use a single Map. The function is still pure
 * as the mutation is isolated within this function, thus referential
 * transparency is preserved.
 */
// fromPairs :: Foldable f => f (Pair a b) -> Map a b
const fromPairs =
	reduceToMap(modify)

// clone :: Map a b -> Map a b
const clone =
	compose(fromPairs, getEntries)

// getKeys :: Map a b -> [ a ]
const getKeys = (m) =>
	collect(m.keys())

/*
 * Follows the parameter order of Crock's getProp
 */
// getValue :: a -> Map a b -> Maybe b
const getValue = curry((key) =>
	compose(safe(isDefined), applyTo(key), get)
)

// getValues :: Map a b -> [ b ]
const getValues = (m) =>
	collect(m.values())

// hasValue :: Map a b -> a -> Boolean
const hasValue = curry((m, key) =>
	m.has(key)
)

// mapEntries :: (Pair a b -> Pair a b) -> Map a b -> Map a b
const mapEntries = curry((fn) =>
	compose(map(fn), getEntries)
)

/*
 * Follows the parameter order of Crock's setProp
 */
// setValue ::  a -> b -> Map a b -> Map a b
const setValue = curry((key, value) =>
	compose(applyTo(value), applyTo(key), set, clone)
)

module.exports = {
	clone,
	fromPairs,
	getEntries,
	getKeys,
	getValue,
	getValues,
	hasValue,
	mapEntries,
	reduceToMap,
	setValue,

	// private functions
	// exposed if performance is needed.
	_get: get,
	_modify: modify,
	_set: set
}
