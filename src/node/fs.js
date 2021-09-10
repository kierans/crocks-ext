"use strict";

const fs = require("fs");
const path = require("path");

const Async = require("crocks/Async");

const bichain = require("crocks/pointfree/bichain");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const chain = require("crocks/pointfree/chain");
const curry = require("crocks/core/curry");
const ifElse = require("crocks/logic/ifElse");
const pipe = require("crocks/helpers/pipe");
const pipeK = require("crocks/helpers/pipeK");
const resultToAsync = require("crocks/Async/resultToAsync");

const { parse} = require("./json");

const readAsync = Async.fromNode(fs.readFile);

const writeAsync = Async.fromNode(fs.writeFile);

const mkdirAsync = Async.fromNode(fs.mkdir);

// dirname :: String -> String
const dirname = (file) => path.dirname(file)

// readFile :: Object -> (String | Buffer | URL | Integer) -> Async Error a
const readFile = curry((opts, path) => readAsync(path, opts))

// ignoreExistingDirectory :: Error -> Async Error undefined
const ignoreExistingDirectory =
	ifElse(
		({ code }) => code === "EEXIST",
		() => Async.Resolved(),
		Async.Rejected
	)

// mkdirsAsync :: (String | Buffer | URL | Integer) -> Async Error undefined
const mkdirsAsync =
	pipe(
		dirname,
		(dir) => mkdirAsync(dir, { recursive: true }),
		bichain(ignoreExistingDirectory, Async.Resolved)
	)

// writeFile :: Object -> (String | Buffer | URL | Integer) -> (String | Buffer | TypedArray | DataView | Object) -> Async Error undefined
const writeFile = curry((opts, path, data) =>
	pipeK(
		constant(mkdirsAsync(path)),
		() => writeAsync(path, data, opts)
	)()
)

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
