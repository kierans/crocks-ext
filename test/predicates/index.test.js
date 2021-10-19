"use strict";

const { assertThat, is } = require("hamjest");

const { matchesRegex } = require("../../src/predicates");

describe("predicates", function() {
	describe("matchesRegexp", function() {
		it("should match regexp", function() {
			assertThat(matchesRegex(/\d{4}/, 2021), is(true));
		});
	});
});
