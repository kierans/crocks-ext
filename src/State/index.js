"use strict";

const evalWith = require("crocks/State/evalWith");
const execWith = require("crocks/State/execWith");
const flip = require("crocks/combinators/flip");

// evalUsing :: State s a -> s -> a
const evalUsing = flip(evalWith);

// execUsing :: State s a -> s -> s
const execUsing = flip(execWith);

module.exports = {
	evalUsing,
	execUsing
}
