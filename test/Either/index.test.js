const { identity } = require("crocks");

const { assertThat, is } = require("hamjest");
const { throwContents, throwResult } = require("../../src/utils");

const { check, checkAfter, checkLift } = require("../../src/Either");

describe("Either", function() {
	const lessThan = (a) => (b) => b < 5
	const double = (x) => x * 2

  describe("check", function() {
		it("should return Right when pred result is true", function() {
			const result = check(lessThan(5), 2).either(throwContents, identity);

			assertThat(result, is(2));
		});

		it("should return Left when pred result is false", function() {
			const result = check(lessThan(5), 7).either(identity, throwResult);

			assertThat(result, is(7));
		});
	});

	describe("checkAfter", function() {
		it("should return Right when pred result is true", function() {
			const result = checkAfter(lessThan(5), double, 2).either(throwContents, identity);

			assertThat(result, is(4));
		});

		it("should return Left when pred result is false", function() {
			const result = checkAfter(lessThan(5), double, 3).either(identity, throwResult);

			assertThat(result, is(6));
		});
	});

	describe("checkLift", function() {
		it("should return mapped Right when pred result is true", function() {
			const result = checkLift(lessThan(5), double, 2).either(throwContents, identity);

			assertThat(result, is(4));
		});

		it("should return Left when pred result is false", function() {
			const result = checkLift(lessThan(5), double, 10).either(identity, throwResult);

			assertThat(result, is(10));
		});
	});
});