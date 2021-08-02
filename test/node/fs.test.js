"use strict";

const fs = require("fs");
const os = require("os");

const { assertThat, is } = require("hamjest");

const { readJSON } = require("../../src/node/fs");

describe("fs", function() {
	describe("readJSON", function() {
		it("should read json", async function() {
			const filename = `${os.tmpdir()}/fs.test.json`;
			fs.writeFileSync(filename, '{ "a": 1 }')

			try {
				const result = await readJSON(filename).toPromise();

				assertThat(result.a, is(1));
			}
			finally {
				fs.unlinkSync(filename);
			}
		});
	});
});
