"use strict";

const { assertThat, throws } = require("hamjest");

const { throwContents } = require("../src/utils");

describe("utils", function() {
	describe("throwContents", function() {
		it("should throw existing error", function() {
			const error = new Error("error");

			assertThat(() => throwContents(error), throws(error));
		})

		const scalars = [ 1, "error", false, null, undefined ];
		scalars.forEach((scalar) => {
			it(`should throw ${typeOf(scalar)}`, function() {
				assertThat(() => throwContents(scalar), throws(scalar));
			})
		})

		it("should stringify object when throwing", function() {
			const error = { a: 1 }

			assertThat(() => throwContents(error), throws(JSON.stringify(error)));
		});

		it("should stringify array when throwing", function() {
			const error = [ 1 ]

			assertThat(() => throwContents(error), throws(JSON.stringify(error)));
		});
	});
});

function typeOf(value) {
	if (value === null) {
		return "null";
	}

	return typeof value;
}
