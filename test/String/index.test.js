"use strict";

const { assertThat, is } = require("hamjest");

const {
	capitalise,
	changeCase,
	fromKebabCase,
	join,
	lowerCase,
	split,
	toCamelCase,
	toKebabCase,
	upperCase
} = require("../../src/String");

describe("String", function() {
	it("should capitalise word", function() {
		assertThat(capitalise("hello"), is("Hello"));
	})

	it("should join word", function() {
		assertThat(join("-", [ "a", "b", "c" ]), is("a-b-c"))
	});

	it("should split word", function() {
		assertThat(split("-", "a-b-c"), is([ "a", "b", "c" ]))
	});

	it("should lower case word", function() {
		assertThat(lowerCase("HELLO"), is("hello"))
	});

	it("should upper case word", function() {
		assertThat(upperCase("hello"), is("HELLO"))
	});

	describe("camelCase", function() {
		it("should camel case words", function() {
			assertThat(toCamelCase([ "a", "var" ]), is("aVar"))
		});

		it("should passthrough single word", function() {
			assertThat(toCamelCase([ "var" ]), is("var"));
		});

		it("should return blank string for empty list", function() {
			assertThat(toCamelCase([]), is(""));
		});
	});

	describe("kebab case", function() {
		it("should kebab case words", function() {
			assertThat(toKebabCase([ "A", "VAR" ]), is("a-var"));
		});

		it("should return blank string for empty list", function() {
			assertThat(toKebabCase([]), is(""));
		})
	});

	it("should change case", function() {
		assertThat(changeCase(fromKebabCase, toCamelCase)("a-var"), is("aVar"));
	});
});
