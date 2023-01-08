"use strict";

const { Pair, bimap, constant, identity, map, merge } = require("crocks");

const { assertThat, equalTo, hasItem, is, not } = require("hamjest");

const {
	clone,
	fromPairs,
	getEntries,
	getKeys,
	getValue,
	getValues,
	hasValue,
	mapEntries,
	reduceToMap,
	setValue,
	_modify: modify
} = require("../../src/Map");

const { throwContents } = require("../../src/utils");

const join = (a, b) => `${a} ${b}`

const mergeEntries = map(merge(join))

describe("Map", function() {
	let people;

	beforeEach(function() {
		people = makePeople();
	});

	describe("clone", function() {
		it("should clone map", function() {
			const result = clone(people);

			assertThat("Same map ref returned", Object.is(result, people), is(not(true)));
			assertThat(result, is(equalTo(people)));
		});
	});

	describe("fromPairs", function() {
		it("should create map from Pairs", function() {
			const data = peoplePairs();

			const result = fromPairs(data);

			assertThat(result, is(equalTo(people)));
		})
	});

	describe("getEntries", function() {
		it("should get entries", function() {
			const result = mergeEntries(getEntries(people));

			assertThat(result.length, is(people.size));
			assertThat(result, hasItem("Bruce Wayne"));
			assertThat(result, hasItem("Clarke Kent"));
			assertThat(result, hasItem("Peter Parker"));
		});
	});

	describe("getKeys", function() {
		it("should return keys", function() {
			const result = getKeys(people);

			assertThat(result, hasItem("Bruce"));
			assertThat(result, hasItem("Clarke"));
			assertThat(result, hasItem("Peter"));
		});
	});

	describe("getValue", function() {
		it("should return value when value present", function() {
			const result = getValue("Bruce", people).either(throwContents, identity);

			assertThat(result, is("Wayne"));
		});

		it("should return nothing when value not present", function() {
			const result = getValue("Steve", people).either(constant("Rogers"), identity);

			assertThat(result, is("Rogers"));
		});
	});

	describe("getValues", function() {
		it("should return values", function() {
			assertThat(getValues(people), is(equalTo([
				"Wayne", "Kent", "Parker"
			])))
		});
	});

	describe("hasValue", function() {
		it("should return true when value present", function() {
			const result = hasValue(people, "Bruce");

			assertThat(result, is(true));
		});

		it("should return false when value not present", function() {
			const result = hasValue(people, "Steve");

			assertThat(result, is(false));
		});
	});

	describe("mapEntries", function() {
		const upper = (str) => str.toUpperCase();

		it("should map entries", function() {
			const result = mergeEntries(mapEntries(bimap(upper, upper), people))

			assertThat(result.length, is(people.size));
			assertThat(result, hasItem("BRUCE WAYNE"));
			assertThat(result, hasItem("CLARKE KENT"));
			assertThat(result, hasItem("PETER PARKER"));
		});
	});

	describe("reduceToMap", function() {
		it("should reduce to map", function() {
			const data = peoplePairs();

			const result = reduceToMap(modify, data);

			assertThat(result, is(equalTo(people)));
		});

		it("should create a new map every time", function() {
			const data = peoplePairs();
			const fn = reduceToMap(modify);

			const a = fn(data);
			const b = fn(data);

			assertThat("Same map ref returned", Object.is(a, b), is(false));
		});
	});

	describe("setValue", function() {
		it("should set value", function() {
			const result = setValue("Steve", "Rogers", people)

			assertThat(result.get("Steve"), is("Rogers"));
			assertThat(people.get("Steve"), is(undefined));
		});
	});
});

function makePeople() {
	const people = new Map();
	people.set("Bruce", "Wayne");
	people.set("Clarke", "Kent");
	people.set("Peter", "Parker");

	return people;
}

function peoplePairs() {
	return [
		Pair("Bruce", "Wayne"),
		Pair("Clarke", "Kent"),
		Pair("Peter", "Parker")
	];
}
