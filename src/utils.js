"use strict";

const compose = require("crocks/helpers/compose");
const flip = require("crocks/combinators/flip");
const identity = require("crocks/combinators/identity");
const ifElse = require("crocks/logic/ifElse");
const isArray = require("crocks/predicates/isArray");
const isEmpty = require("crocks/predicates/isEmpty");
const isObject = require("crocks/predicates/isObject");
const isSameType = require("crocks/predicates/isSameType");
const isString = require("crocks/predicates/isString");
const or = require("crocks/logic/or");
const pipe = require("crocks/helpers/pipe");

const { stringify, joinPair } = require("./String");

// isScalar :: a -> Boolean
const isScalar =
	or(isEmpty, isString)

// isNonScalar :: a -> Boolean
const isNonScalar =
	or(isArray, isObject)

// toString :: a -> String
const toString =
	ifElse(isNonScalar, stringify, String)

// throwValue :: a -> throws
const throwValue = (value) => {
	throw new Error(value)
}

// throwError :: (a -> a | throws)
const throwError =
	ifElse(isSameType(Error), (e) => { throw e }, identity)

const throwNonScalar =
	ifElse(isNonScalar, compose(throwValue, stringify), identity)

// throwScalar :: (a -> a | throws)
const throwScalar =
	ifElse(isScalar, compose(throwValue, toString), identity)

/*
 * Throws the contents when folding out a Functor.
 *
 * Wraps any non Error in an Error.
 */
// throwContents :: a -> throws
const throwContents =
	pipe(
		throwError,
		throwNonScalar,
		throwScalar,
		throwValue
	)

/*
 * Wraps the value in an Error with a message and throws.
 *
 * Useful when you want to indicate a successful case was the wrong outcome.
 */
const throwResult =
	compose(throwValue, flip(joinPair(" "))(`returned`), toString)

module.exports = {
	throwContents,
	throwResult
}
