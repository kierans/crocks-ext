"use strict";

const { assertThat, equalTo, is } = require("hamjest");

const { arrayToTuple } = require("../../src/Tuple");

describe("Tuple", function() {
	describe("arrayToTuple", function() {
		it("should convert array to tuple", function() {
			const arr = [ 1, 2, 3, 4 ];
			const result = arrayToTuple(arr)

			assertThat(result.toArray(), is(equalTo(arr)));
		});
	});
});
