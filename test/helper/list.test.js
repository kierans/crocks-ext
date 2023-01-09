"use strict";

const { assertThat, hasItem, hasSize } = require("hamjest");

const {
	unique
} = require("../../src/helpers/lists");

describe("list helpers", function() {
	describe("unique", function() {
		it("should filter list for unique items", function() {
			const items = [
				"milk",
				"bread",
				"jam",
				"bread",
				"milk"
			];

			const result = unique(items);

			assertThat(result, hasSize(3));
			assertThat(result, hasItem("milk"));
			assertThat(result, hasItem("bread"));
			assertThat(result, hasItem("jam"));
		});
	});
});
