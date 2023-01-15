"use strict";

const fs = require("fs");
const path = require("path");

const Async = require("crocks/Async");

const bichain = require("crocks/pointfree/bichain");
const binary = require("crocks/helpers/binary");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const converge = require("crocks/combinators/converge");
const chain = require("crocks/pointfree/chain");
const curry = require("crocks/core/curry");
const ifElse = require("crocks/logic/ifElse");
const flip = require("crocks/combinators/flip");
const liftA2 = require("crocks/helpers/liftA2");
const map = require("crocks/pointfree/map");
const mapReduce = require("crocks/helpers/mapReduce");
const nAry = require("crocks/helpers/nAry");
const pipe = require("crocks/helpers/pipe");
const resultToAsync = require("crocks/Async/resultToAsync");
const substitution = require("crocks/combinators/substitution");

const { parse } = require("./json");
const { zipToPair } = require("../helpers/zip");

const trinary = nAry(3);

// readAsync :: String -> Object -> Async Error a
const readAsync = binary(Async.fromNode(fs.readFile));

// writeAsync :: String -> a -> Object -> Async Error Unit
const writeAsync = trinary(Async.fromNode(fs.writeFile));

// mkdirAsync :: String -> Object -> Async Error Unit
const mkdirAsync = binary(Async.fromNode(fs.mkdir));

// dirname :: String -> String
const dirname = (file) => path.dirname(file)

// joinPaths :: String -> String -> String
const joinPaths = binary((...paths) =>
	path.join(...paths)
)

// readDir -> String -> Async Error [ String ]
const readDir =
	converge(
		// Async Error [ String ]
		compose(map, map),
		joinPaths,
		Async.fromNode(fs.readdir)
	)

// readFile :: Object -> (String | Buffer | URL | Integer) -> Async Error a
const readFile = flip(readAsync)

// readDirContents :: Object -> String -> Async Error [ Pair (String a) ]
const readDirContents = curry((opts) =>
	pipe(
		readDir,
		substitution(
			liftA2(binary(zipToPair)),
			chain(compose(Async.all, map(readFile(opts))))
		)
	)
)

// ignoreExistingDirectory :: Error -> Async Error undefined
const ignoreExistingDirectory =
	ifElse(
		({ code }) => code === "EEXIST",
		constant(Async.Resolved),
		Async.Rejected
	)

// mkdirsAsync :: (String | Buffer | URL | Integer) -> Async Error Unit
const mkdirsAsync =
	pipe(
		dirname,
		flip(mkdirAsync, { recursive: true }),
		bichain(ignoreExistingDirectory, Async.Resolved)
	)

// writeFile :: Object -> (String | Buffer | URL | Integer) -> (String | Buffer | TypedArray | DataView | Object) -> Async Error Unit
const writeFile = curry((opts, path, data) =>
	mapReduce(constant, flip(chain), Async.Resolved(), [
		mkdirsAsync(path),
		writeAsync(path, data, opts)
	])
)

/*
 * `writeToDir` allows a base dir to be set to write files to.
 *
 * When the relative filename and data is given, the result from `writeFile` is returned.
 */
// writeToDir :: Object -> String -> String -> (String | Buffer | TypedArray | DataView | Object) -> Async Error Unit
const writeToDir = curry((opts, dir) =>
	compose(writeFile(opts), joinPaths(dir))
)

// readJSON :: (String | Buffer | URL | Integer) -> Async Error a
const readJSON =
	pipe(
		readFile({ encoding: "utf8" }),
		chain(compose(resultToAsync, parse)),
	)

module.exports = {
	readDir,
	readDirContents,
	readFile,
	readJSON,
	writeFile,
	writeToDir
}
