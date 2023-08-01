const Either = require("crocks/Either");

const applyTo = require("crocks/combinators/applyTo");
const compose = require("crocks/helpers/compose");
const composeB = require("crocks/combinators/composeB");
const curry = require("crocks/helpers/curry");
const ifElse = require("crocks/logic/ifElse");
const map = require("crocks/pointfree/map");

/*
 * Much like Crock's inbuilt `safe`, `check` will run the provided value 
 * through the predicate function, and if it succeeds will lift the value into a Right.
 * 
 * However, if the predicate fails, instead of "nothing", a Left will be returned
 * with the original value.
 * 
 * This allows the orginal value to be retained and multiple checks to be chained
 * together.
 */
// check :: ((a -> Boolean) | Pred) -> a -> Either a
const check = curry(compose(applyTo(Either.Left), applyTo(Either.Right), ifElse))

/*
 * Much like Crock's inbuilt `safeAfter`, you might want to lift the result of a function 
 * into a Either based on some predicate. `checkAfter` will run the function and evaluate
 * the result against the predicate.
 * 
 * If the predicate result is true, the value will be lifted into a Right, else the value
 * will be lifted into a Left.
 */
// checkAfter :: ((b -> Boolean) | Pred) -> (a -> b) -> a -> Either b
const checkAfter = curry(composeB(composeB, check))

/*
 * Much like Crock's inbuilt `safeLift`, when you want to run a function in the safety of the
 * Either context, `checkLift` can help.
 *
 * Based on the predicate evaluation the value wil be lifted into a Left or Right and then
 * have the function mapped over the result.
 */
// checkLift :: ((a -> Boolean) | Pred) -> (a -> b) -> a -> Either a b
const checkLift = curry((pred, fn) =>
	compose(map(fn), check(pred))
)

module.exports = {
	check,
	checkAfter,
	checkLift
}