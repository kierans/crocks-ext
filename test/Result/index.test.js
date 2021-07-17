"use strict";

const constant = require("crocks/combinators/constant");
const identity = require("crocks/combinators/identity");

const { assertThat, is } = require("hamjest");

const { getProp, getPath } = require("../../src/Result");

const { throwError } = require("../../src/utils");

describe("Result", function() {
	describe("object props", function() {
		const data = [
			{
				id: "getProp",
				fn: getProp,
				good: "name",
				bad: "foo",
				data: {
					name: "Batman"
				}
			},
			{
				id: "getPath",
				fn: getPath,
				good: [ "name", "first" ],
				bad: [ "foo" ],
				data: {
					name: {
						first: "Bruce",
						last: "Wayne"
					}
				}
			}
		];

		runTest(data)
	});

	describe("array index", function() {
		const data = [
			{
				id: "getProp",
				fn: getProp,
				good: 0,
				bad: 1,
				data: [
					"Batman"
				]
			},
			{
				id: "getPath",
				fn: getPath,
				good: [ 0, 0 ],
				bad: [ 0, 1 ],
				data: [
					[
						"Batman"
					]
				]
			}
		];

		runTest(data)
	});

	function runTest(data) {
		data.forEach((datum) => {
			describe(datum.id, function() {
				const err = new Error("fake error");
				const illegalCall = () => { throw new Error("Error factory called"); }

				it("should return value when found", function() {
					// this also tests that the error is evaluated lazily
					const result = datum.fn(illegalCall, datum.good, datum.data);

					result.either(throwError, identity);
				});

				it("should return error when value not found", function() {
					const result = datum.fn(constant(err), datum.bad, datum.data);

					const e = result.either(identity, throwError);

					assertThat(e, is(err));
				});
			});
		});
	}
});
