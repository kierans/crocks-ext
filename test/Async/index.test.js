"use strict";

const constant = require("crocks/combinators/constant");

const { isRejectedWith, promiseThat } = require("hamjest");

const { getProp, getPath } = require("../../src/Async");

describe("Async", function() {
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
