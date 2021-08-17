"use strict";

const identity = require("crocks/combinators/identity");

const { allOf, assertThat, equalTo, hasProperty, instanceOf, is } = require("hamjest");

const { parse, pretty, stringify } = require("../../src/node/json");
const { throwContents, throwResult } = require("../../src/utils");

describe("JSON", function() {
	describe("parsing", function() {
		it("should parse JSON", function() {
			const result = parse('{ "a": 1 }').either(throwContents, identity)

			assertThat(result, is(equalTo({ a: 1 })))
		});

		it("should return error on parsing error", function() {
			const result = parse('{').either(identity, throwResult)

			assertThat(result, is(instanceOf(Error)))
		});
	});

	describe("stringifying", function() {
		it("should stringify data", function() {
			const data = { a: 1}

			const result = stringify(data).either(throwContents, identity)

			assertThat(result, is('{"a":1}'))
		});

		it("should return error on stringify error", function() {
			const data = { a: BigInt(Number.MAX_SAFE_INTEGER + 1) }

			const result = stringify(data).either(identity, throwResult)

			assertThat(result, is(allOf(
				instanceOf(TypeError),
				hasProperty("message", "Do not know how to serialize a BigInt")
			)))
		});

		it("should pretty print json", function() {
			const data = { a: 1}

			const result = pretty(2)(data).either(throwContents, identity)

			assertThat(result, is('{\n  "a": 1\n}'))
		});
	});
});
