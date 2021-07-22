"use strict";

const flip = require("crocks/combinators/flip");
const tryCatch = require("crocks/Result/tryCatch");

// parse :: String -> Result Error a
const parse = tryCatch(flip(JSON.parse, undefined))

// pretty :: Number -> a -> Result Error String
const pretty = (spaces) => tryCatch((a) => JSON.stringify(a, null, spaces))

// stringify :: a -> Result Error String
const stringify = tryCatch((a) => JSON.stringify(a))

module.exports = {
	parse,
	pretty,
	stringify
}
