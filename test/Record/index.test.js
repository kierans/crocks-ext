"use strict";

const { pluck } = require("../../src/Record");

const { assertThat, is } = require("hamjest");

describe("Record", function() {
	describe("pluck", function() {
		it("should pluck value from record", function() {
			const name = "Bruce Wayne";
			const record = { name };

			const value = pluck("name", record);

			assertThat(value, is(name));
		});
	});
});
