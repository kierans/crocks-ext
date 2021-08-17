"use strict";

const constant = require("crocks/combinators/constant");
const identity = require("crocks/combinators/identity");

const { assertThat, is } = require("hamjest");

const { getProp, getPath, safeResult } = require("../../src/Result");

const { throwContents, throwResult } = require("../../src/utils");

describe("Result", function() {
	describe("getOrError", function() {
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

						result.either(throwContents, identity);
					});

					it("should return error when value not found", function() {
						const result = datum.fn(constant(err), datum.bad, datum.data);

						const e = result.either(identity, throwContents);

						assertThat(e, is(err));
					});
				});
			});
		}
	});

	describe("safeResult", function() {
		const gt = (n) => (x) => x > n

		it("should return Ok when pred is true", function() {
			const error = () => { throw new Error("should not have been called") }
			const result = safeResult(error, gt(10), 20).either(throwContents, identity)

			assertThat(result, is(20));
		});

		it("should return Err when pred is false", function() {
			const n = 10;
			const error = (x) => `${x} is not gt ${n}`;

			const result = safeResult(error, gt(n), 5).either(identity, throwResult)

			assertThat(result, is("5 is not gt 10"));
		});
	});
});
