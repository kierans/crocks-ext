"use strict";

const Assign = require("crocks/Assign");

const compose = require("crocks/helpers/compose");
const foldMap = require("crocks/pointfree/foldMap");
const identity = require("crocks/combinators/identity");
const valueOf = require("crocks/pointfree/valueOf");

const { Just } = require("crocks/Maybe");
const { assertThat, is } = require("hamjest");

const {
	applyFunctor,
	chainLiftA2,
	emptyTail
} = require("../../src/helpers");
const { throwContents } = require("../../src/utils");

describe("helpers", function() {
	describe("applyFunctor", function() {
		it("should apply functor to value", function() {
			const fns = [
				(x) => ({ y: x + 1 }),
				(x) => ({ z: x + 2 })
			]

			const flow = compose(valueOf, foldMap(Assign), applyFunctor(fns))
			const result = flow(1);

			assertThat(result.y, is(2));
			assertThat(result.z, is(3));
		})
	});

	describe("chainLiftA2", function() {
		const add = (a) => (b) => Just(a + b)

		it("should unwrap inner applicative", function() {
			const result = chainLiftA2(add, Just(2), Just(3));

			assertThat(result.option(0), is(5));
		});

		it("should curry arguments", function() {
			const result = chainLiftA2(add)(Just(2))(Just(3));

			assertThat(result.option(0), is(5));
		});
	});

	describe("emptyTail", function() {
		it("should return empty list for tail", function() {
			const list = [];

			assertThat(emptyTail(list).either(throwContents, identity), is(list));
		});

		it("should return tail when non empty", function() {
			const list = [ "a", "b", "c", ];

			assertThat(emptyTail(list).either(throwContents, identity), is([ "b", "c" ]));
		});
	});
});
