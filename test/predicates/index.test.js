"use strict";

const { assertThat, is } = require("hamjest");

const {
	isGreaterThan,
	isGreaterThanEqualTo,
	isLessThan,
	isLessThanEqualTo,
	matchesRegex
} = require("../../src/predicates");

describe("predicates", function() {
	describe("matchesRegexp", function() {
		it("should match regexp", function() {
			assertThat(matchesRegex(/\d{4}/, 2021), is(true));
		});
	});

	describe("comparison predicates", function() {
		it("should compare greaterThan", function() {
			assertThat(isGreaterThan(3, 2), is(false));
			assertThat(isGreaterThan(2, 3), is(true));
		});

		it("should compare greaterThanEqualTo", function() {
			assertThat(isGreaterThanEqualTo(3, 2), is(false));
			assertThat(isGreaterThanEqualTo(2, 3), is(true));
			assertThat(isGreaterThanEqualTo(2, 2), is(true));
		});

		it("should compare lessThan", function() {
			assertThat(isLessThan(3, 2), is(true));
			assertThat(isLessThan(2, 3), is(false));
		});

		it("should compare lessThanEqualTo", function() {
			assertThat(isLessThanEqualTo(3, 2), is(true));
			assertThat(isLessThanEqualTo(2, 3), is(false));
			assertThat(isLessThanEqualTo(2, 2), is(true));
		});
	});
});
