"use strict";

const { assertThat, throws } = require("hamjest");

const { throwContents, throwResult } = require("../src/utils");

const scalars = [ 1, "error", false, null, undefined ];

describe("utils", function() {
	describe("throwContents", function() {
		it("should throw existing error", function() {
			const error = new Error("error");

			assertThat(() => throwContents(error), throws(error));
		})

		scalars.forEach((scalar) => {
			it(`should throw ${typeOf(scalar)}`, function() {
				assertThat(() => throwContents(scalar), throws(new Error(String(scalar))));
			})
		})

		it("should stringify object when throwing", function() {
			const obj = { a: 1 }

			assertThat(() => throwContents(obj), throws(new Error(JSON.stringify(obj))));
		});

		it("should stringify array when throwing", function() {
			const arr = [ 1 ]

			assertThat(() => throwContents(arr), throws(new Error(JSON.stringify(arr))));
		});
	});

	describe("throwResult", function() {
		const toMessage = (value) => `${value} returned`

		scalars.forEach((scalar) => {
			it(`should throw ${typeOf(scalar)}`, function() {
				assertThat(() => throwResult(scalar), throws(new Error(toMessage(scalar))));
			})
		})

		it("should stringify object when throwing", function() {
			const obj = { a: 1 }

			assertThat(() => throwResult(obj), throws(new Error(toMessage(JSON.stringify(obj)))));
		});

		it("should stringify array when throwing", function() {
			const arr = [ 1 ]

			assertThat(() => throwResult(arr), throws(new Error(toMessage(JSON.stringify(arr)))));
		});
	});
});

function typeOf(value) {
	if (value === null) {
		return "null";
	}

	return typeof value;
}
