"use strict";

const { tupleToArray } = require("crocks");

const {
	allOf,
	assertThat,
	equalTo,
	hasProperty,
	instanceOf,
	is,
	throws
} = require("hamjest");

const {
	zipArgs,
	zipToArray,
	zipToPair,
	zipToTuple
} = require("../../src/helpers/zip");

// pairToArray :: Pair a b -> [ a, b ]
const pairToArray = (p) => p.toArray()

describe("zip helpers", function() {
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

	describe("zipToArray", function() {
		it("should zip to array", function() {
			const result = zipToArray(
				[ 1, 4, 7 ],
				[ 2, 5, 8 ],
				[ 3, 6, 9 ]
			);

			assertThat(result, is(equalTo([
				[ 1, 2, 3 ],
				[ 4, 5, 6 ],
				[ 7, 8, 9 ]
			])))
		});

		it("should zip to length of shortest array", function() {
			const result = zipToArray(
				[ 1, 4, 7 ],
				[ 2, 5 ],
				[ 3, 6, 9 ]
			);

			assertThat(result, is(equalTo([
				[ 1, 2, 3 ],
				[ 4, 5, 6 ]
			])))
		});
	});

	describe("zipToTuple", function() {
		it("should zip to tuple", function() {
			const result =
				zipToTuple(
					[ 1, 4, 7 ],
					[ 2, 5, 8 ],
					[ 3, 6, 9 ]
				)
				.map(tupleToArray);

			assertThat(result, is(equalTo([
				[ 1, 2, 3 ],
				[ 4, 5, 6 ],
				[ 7, 8, 9 ]
			])));
		});

		it("should zip to length of shortest array", function() {
			const result =
				zipToTuple(
					[ 1, 4, 7 ],
					[ 2, 5 ],
					[ 3, 6, 9 ]
				)
				.map(tupleToArray);

			assertThat(result, is(equalTo([
				[ 1, 2, 3 ],
				[ 4, 5, 6 ]
			])))
		});
	});

	describe("zipToPair", function() {
		it("should zip to pair", function() {
			const result =
				zipToPair(
					[ 1, 4, 7 ],
					[ 2, 5, 8 ]
				)
				.map(pairToArray);

			assertThat(result, is(equalTo([
				[ 1, 2 ],
				[ 4, 5 ],
				[ 7, 8 ]
			])))
		});

		it("should throw error is array length too short", function() {
			const fn = () => zipToPair(
				[ 1, 4, 7 ]
			);

			assertThat(fn, throws(typeError()))
		});

		it("should throw error is array length too big", function() {
			const fn = () => zipToPair(
				[ 1, 4, 7 ],
				[ 2, 5, 8 ],
				[ 3, 6, 9 ]
			);

			assertThat(fn, throws(typeError()))
		});

		it("should zip to length of shortest array", function() {
			const result =
				zipToPair(
					[ 1, 4, 7 ],
					[ 2, 5 ]
				)
				.map(pairToArray);

			assertThat(result, is(equalTo([
				[ 1, 2 ],
				[ 4, 5 ]
			])))
		});
	});
});

function typeError() {
	return allOf(
		instanceOf(TypeError),
		hasProperty("message", "zipToPair: requires two arrays")
	)
}
