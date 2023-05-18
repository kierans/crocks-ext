"use strict";

const flip = require("crocks/combinators/flip");
const runWith = require("crocks/pointfree/runWith");

// runUsing :: m -> a -> b
const runUsing = flip(runWith);

module.exports = {
	runUsing
}
