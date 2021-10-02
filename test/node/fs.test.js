"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const rimraf = require("rimraf");

const { assertThat, is } = require("hamjest");

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
	});

	function rmFile(filename) {
		return async function() {
			await rimraf.sync(filename);
		}
	}
});
