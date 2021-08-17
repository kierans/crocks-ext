"use strict";

const Result = require("crocks/Result");

const compose = require("crocks/helpers/compose");
const curry = require("crocks/helpers/curry");
const either = require("crocks/pointfree/either");
const getPath = require("crocks/Maybe/getPath");
const getProp = require("crocks/Maybe/getProp");
const ifElse = require("crocks/logic/ifElse");
const pipe = require("crocks/helpers/pipe");

/*
 * A version of `getPath` from Crocks that returns a Result with an error if the path does
 * not exist rather than Nothing. Better for validation scenarios.
 *
 * When the path is passed to the error it is joined into a string for ease of reporting.
 */
// getPathOrError :: (String -> a) -> [ String | Integer ] -> b -> Result a c
const getPathOrError = curry((error, path) =>
	pipe(
		getPath(path),
		either(() => Result.Err(error(path)), Result.of)
	)
)

/*
 * A version of `getProp` from Crocks that returns a Result with an error if the prop does
 * not exist rather than Nothing. Better for validation scenarios.
 */
// getPropOrError :: ((String | Integer) -> a) -> (String | Integer) -> b -> Result a c
const getPropOrError = curry((error, prop) =>
	pipe(
		getProp(prop),
		either(() => Result.Err(error(prop)), Result.of)
	)
)

/*
 * Like Maybe's `safe` but for a Result.
 *
 * `safeResult` takes a function for creating the error, a predicate and some value.
 *
 * If the predicate fails, the data is passed to the error function and a Result.Err is returned,
 * else a Result.Ok is returned wrapping the data.
 */
// safeResult :: (b -> c) -> ((b -> Boolean) | Pred) -> b -> Result c a
const safeResult = curry((error, pred) =>
	ifElse(
		pred,
		Result.Ok,
		compose(Result.Err, error)
	)
)

module.exports = {
	getPath: getPathOrError,
	getProp: getPropOrError,
	safeResult
}
