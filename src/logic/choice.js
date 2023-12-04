"use strict";

const applyTo = require("crocks/combinators/applyTo");
const binary = require("crocks/helpers/binary");
const compose = require("crocks/helpers/compose");
const identity = require("crocks/combinators/identity");
const ifElse = require("crocks/logic/ifElse");
const isSame = require("crocks/predicates/isSame");

// choose :: [(a -> b)] -> a -> b
function choose(...cases) {
	if (cases.length < 1) {
		throw new TypeError(
			"choose: Functions required"
		);
	}

	if (cases.length < 2) {
		throw new TypeError(
			"choose: Default function required"
		)
	}

	const last = cases[cases.length - 1];
	const rest = cases.slice(0, -1);

	return rest.reduceRight(binary(applyTo), last);
}

// when :: (a -> Boolean) | Pred -> (a -> b) -> (a -> c) -> a -> (b | c)
const when = ifElse

// otherwise :: a -> a
const otherwise = identity

module.exports = {
	choose,
	otherwise,
	when
}
