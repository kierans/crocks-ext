"use strict";

const Tuple = require("crocks/Tuple");

const converge = require("crocks/combinators/converge");
const identity = require("crocks/combinators/identity");

const { length } = require("../helpers/lists");

// arrayToTuple :: [ a ] -> n-Tuple
const arrayToTuple =
	converge((n, args) => Tuple(n)(...args), length, identity)

module.exports = {
	arrayToTuple
}
