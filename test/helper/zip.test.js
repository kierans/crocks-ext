"use strict";

const { assertThat, is } = require("hamjest");

const {
	zipArgs
} = require("../../src/helpers/zip");

describe("zip helps", function() {
	describe("zipArgs", function() {
		it("should collect args", function() {
			const one = () => 1
			const two = () => 2
			const three = () => 3

			const result = zipArgs(one, two, three);

			assertThat(result.length, is(3));
			assertThat(result[0], is(one));
			assertThat(result[1], is(two));
			assertThat(result[2], is(three));
		})
	});
});
