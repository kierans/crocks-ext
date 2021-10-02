"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const rimraf = require("rimraf");

const {
	allOf,
	assertThat,
	hasProperty,
	instanceOf,
	is,
	isRejectedWith,
	promiseThat
} = require("hamjest");

const { readJSON, writeFile } = require("../../src/node/fs");

describe("fs", function() {
	describe("readJSON", function() {
		const filename = `${os.tmpdir()}/fs.test.json`;

		beforeEach(rmFile(filename))
		afterEach(rmFile(filename))

		it("should read json", async function() {
			fs.writeFileSync(filename, '{ "a": 1 }')

			const result = await readJSON(filename).toPromise();

			assertThat(result.a, is(1));
		});
	});

	describe("writeFile", function() {
		const writeStringFile = writeFile({ encoding: "utf8" });

		const filename = `${os.tmpdir()}/a/b/c/fs.test.json`

		beforeEach(rmFile(`${os.tmpdir()}/a`))
		afterEach(rmFile(`${os.tmpdir()}/a`))

		it("should create directories when saving file", async function() {
			const result = await writeStringFile(filename, '{ "a": 1 }').toPromise()

			assertThat(result, is(undefined));
			await fs.promises.stat(filename);
		});

		it("should reuse existing directories when saving file", async function() {
			const dirs = path.dirname(filename);
			await fs.promises.mkdir(dirs, { recursive: true });

			const result = await writeStringFile(filename, '{ "a": 1 }').toPromise()

			assertThat(result, is(undefined));
			await fs.promises.stat(filename);
		});

		it("should return error when unable to mkdir", async function() {
			const dir = path.dirname(filename);
			const parent = dirParent(dir)

			await fs.promises.mkdir(parent, { recursive: true });

			// make the parent directory non writeable so that we force an error
			await fs.promises.chmod(parent, 0o500);

			await promiseThat(
				writeStringFile(filename, '{ "a": 1 }').toPromise(),
				isRejectedWith(
					allOf(
						instanceOf(Error),
						hasProperty("message", `EACCES: permission denied, mkdir '${dir}'`)
					)
				)
			)
		});
	});

	function rmFile(filename) {
		return async function() {
			await rimraf.sync(filename);
		}
	}

	function dirParent(dir) {
		const segments = dir.split("/");
		segments.pop();

		return segments.join("/");
	}
});
