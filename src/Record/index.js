"use strict";

const curry = require("crocks/helpers/curry");

// pluck :: String -> Object -> a
const pluck = curry((key, value) =>
	value[key]
)

module.exports = {
	pluck
}
