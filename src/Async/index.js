"use strict";

const compose = require("crocks/helpers/compose");
const nAry = require("crocks/helpers/nAry");
const resultToAsync = require("crocks/Async/resultToAsync");

const { getPath, getProp, safeResult } = require("../Result");

/*
 * Like `getPath` for Result, but returning an Async instead
 */
// getPathOrError :: (String -> a) -> [ String | Integer ] -> b -> Async a c
const getPathOrError = nAry(3, compose(resultToAsync, getPath))

/*
 * Like `getProp` for Result, but returning an Async instead
 */
// getPropOrError :: ((String | Integer) -> a) -> (String | Integer) -> b -> Async a c
const getPropOrError = nAry(2, compose(resultToAsync, getProp))

// safeAsync :: (b -> c) -> ((b -> Boolean) | Pred) -> b -> Async c a
const safeAsync = nAry(2, compose(resultToAsync, safeResult))

module.exports = {
	getPath: getPathOrError,
	getProp: getPropOrError,
	safeAsync
}
