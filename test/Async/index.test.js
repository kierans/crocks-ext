"use strict";

const constant = require("crocks/combinators/constant");

const { assertThat, promiseThat, is, isRejectedWith } = require("hamjest");

const { getProp, getPath, safeAsync } = require("../../src/Async");

describe("Async", function() {
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

					it("should return value when found", async function() {
						await datum.fn(illegalCall, datum.good, datum.data).toPromise();
					});

					it("should return error when value not found", async function() {
						await promiseThat(
							datum.fn(constant(err))(datum.bad)(datum.data).toPromise(),
							isRejectedWith(err)
						)
					});
				});
			});
		}
	});

	describe("safeAsync", function() {
		const gt = (n) => (x) => x > n

		it("should return Resolved when pred is true", async function() {
			const error = () => { throw new Error("should not have been called") }
			const result = await safeAsync(error, gt(10), 20).toPromise();

			assertThat(result, is(20));
		});

		it("should return Err when pred is false", async function() {
			const n = 10;
			const error = (x) => `${x} is not gt ${n}`;

			await promiseThat(
				safeAsync(error, gt(n), 5).toPromise(),
				isRejectedWith("5 is not gt 10")
			)
		});
	});
});
