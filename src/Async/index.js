"use strict";

const compose = require("crocks/helpers/compose");
const nAry = require("crocks/helpers/nAry");
const resultToAsync = require("crocks/Async/resultToAsync");

const { getPath, getProp } = require("../Result");

/*
 * Like `getPath` for Result, but returning an Async instead
 */
// getPathOrError :: (String -> a) -> [ String | Integer ] -> b -> Async a c
const getPathOrError = nAry(3, compose(resultToAsync, getPath))

/*
 * Like `getProp` for Result, but returning an Async instead
 */
// getPropOrError :: ((String | Integer) -> a) -> (String | Integer) -> b -> Async a c
const getPropOrError = nAry(3, compose(resultToAsync, getProp))

module.exports = {
	getPath: getPathOrError,
	getProp: getPropOrError
}
