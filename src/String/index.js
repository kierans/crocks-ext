"use strict";

const Endo = require("crocks/Endo");

const binary = require("crocks/helpers/binary");
const compose = require("crocks/helpers/compose");
const curry = require("crocks/helpers/curry");
const fanout = require("crocks/Pair/fanout");
const head = require("crocks/pointfree/head");
const map = require("crocks/pointfree/map");
const merge = require("crocks/pointfree/merge");
const mreduce = require("crocks/helpers/mreduce");
const option = require("crocks/pointfree/option");
const pipe = require("crocks/helpers/pipe");

const { emptyTail, prepend, zipArgs } = require("../helpers");

// capitalise :: String -> String
const capitalise = (str) => `${str[0].toUpperCase()}${str.substring(1)}`

// join :: String -> [ String ] -> String
const join = curry((sep, arr) => arr.join(sep))

// split :: String -> String -> [ String ]
const split = curry((sep, str) => str.split(sep))

// lowerCase :: String -> String
const lowerCase = (str) => str.toLowerCase()

// upperCase :: String -> String
const upperCase = (str) => str.toUpperCase()

// toCamelCase :: [ String ] -> String
const toCamelCase =
	pipe(
		fanout(head, emptyTail),
		map(map(compose(join(""), map(capitalise)))),
		merge(prepend),
		option("")
	)

// toKebabCase :: [ String ] -> String
const toKebabCase =
	pipe(
		map(lowerCase),
		join("-")
	)

// changeCase :: (String -> [ String ]) -> ([ String ] -> String) -> String -> String
const changeCase = binary(compose(mreduce(Endo), zipArgs))

// fromKebabCase
const fromKebabCase = split("-")

module.exports = {
	capitalise,
	changeCase,
	fromKebabCase,
	join,
	lowerCase,
	split,
	toCamelCase,
	toKebabCase,
	upperCase
}
