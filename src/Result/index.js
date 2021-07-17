"use strict";

const Result = require("crocks/Result");

const curry = require("crocks/helpers/curry");
const either = require("crocks/pointfree/either");
const getPath = require("crocks/Maybe/getPath");
const getProp = require("crocks/Maybe/getProp");
const pipe = require("crocks/helpers/pipe");

/*
 * A version of `getPath` from Crocks that returns a Result with an error if the path does
 * not exist rather than Nothing. Better for validation scenarios.
 *
 * When the path is passed to the error it is joined into a string for ease of reporting.
 */
// getPathOrError :: (String -> a) -> [ String | Integer ] -> b -> Result a c
const getPathOrError = curry((error, path, obj) =>
	pipe(
		getPath(path),
		either(() => Result.Err(error(path.join("."))), Result.of)
	)(obj)
);

/*
 * A version of `getProp` from Crocks that returns a Result with an error if the prop does
 * not exist rather than Nothing. Better for validation scenarios.
 */
// getPropOrError :: ((String | Integer) -> a) -> (String | Integer) -> b -> Result a c
const getPropOrError = curry((error, prop, obj) =>
	pipe(
		getProp(prop),
		either(() => Result.Err(error(prop)), Result.of)
	)(obj)
);

module.exports = {
	getPath: getPathOrError,
	getProp: getPropOrError
}
