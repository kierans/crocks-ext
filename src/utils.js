"use strict";

const ifElse = require("crocks/logic/ifElse");
const isSameType = require("crocks/predicates/isSameType");

/*
 * Throws an error when folding out a Functor.
 *
 * If used for the "left" or "error" side, will throw whatever is present as an error.
 *
 * If used for the "right" or "success" side, will throw an error indicating that the success
 * case occurred.
 */
// throwError :: a -> throws
exports.throwError =
	ifElse(
		isSameType(Error),
		(e) => { throw e },
		(value) => { throw new Error(`${value} returned instead of error`) }
	)
