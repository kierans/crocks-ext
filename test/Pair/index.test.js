"use strict";

const {
	allOf,
	assertThat,
	hasProperty,
	instanceOf,
	is,
	throws,
} = require("hamjest");

const { arrayToPair } = require("../../src/Pair");

describe("Pair", function() {
	describe("arrayToPair", function() {
		it("should throw error if array too small", function() {
			assertThat(() => arrayToPair([ 1 ]), throws(typeError()))
		});

		it("should throw error if array too big", function() {
			assertThat(() => arrayToPair([ 1, 2, 3 ]), throws(typeError()))
		});

		it("should convert array to Pair", function() {
			const firstName = "Bruce";
			const surname = "Wayne";

			const result = arrayToPair([ firstName, surname ]);

			assertThat(result.fst(), is(firstName));
			assertThat(result.snd(), is(surname));
		});
	});
});

function typeError() {
	return allOf(
		instanceOf(TypeError),
		hasProperty("message", "arrayToPair: Array must be of length 2")
	)
}
