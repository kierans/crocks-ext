"use strict";

const Assign = require("crocks/Assign");

const compose = require("crocks/helpers/compose");
const foldMap = require("crocks/pointfree/foldMap");
const valueOf = require("crocks/pointfree/valueOf");

const { Just } = require("crocks/Maybe");
const { assertThat, is } = require("hamjest");

const { applyFunctor, chainLiftA2, zipArgs } = require("../../src/helpers");

describe("helpers", function() {
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

	describe("zipArgs", function() {
		it("should collect args", function() {
			const one = () => 1
			const two = () => 2
			const three = () => 3

			const result = zipArgs(one, two, three);

			assertThat(result.length, is(3));
			assertThat(result[0], is(one));
			assertThat(result[1], is(two));
			assertThat(result[2], is(three));
		})
	});
});
