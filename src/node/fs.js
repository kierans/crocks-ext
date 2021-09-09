"use strict";

const fs = require("fs");

const Async = require("crocks/Async");

const compose = require("crocks/helpers/compose");
const chain = require("crocks/pointfree/chain");
const curry = require("crocks/core/curry");
const pipe = require("crocks/helpers/pipe");
const resultToAsync = require("crocks/Async/resultToAsync");

const { parse} = require("./json");

const readAsync = Async.fromNode(fs.readFile);

const writeAsync = Async.fromNode(fs.writeFile);

// readFile :: Object -> (String | Buffer | URL | Integer) -> Async Error a
const readFile = curry((opts, path) => readAsync(path, opts))

// writeFile :: Object -> (String | Buffer | URL | Integer) -> (String | Buffer | TypedArray | DataView | Object) -> Async Error a
const writeFile = curry((opts, path, data) => writeAsync(path, data, opts))

// readJSON :: (String | Buffer | URL | Integer) -> Async Error a
const readJSON =
	pipe(
		readFile({ encoding: "utf8" }),
		chain(compose(resultToAsync, parse)),
	)

module.exports = {
	readFile,
	readJSON,
	writeFile
}
