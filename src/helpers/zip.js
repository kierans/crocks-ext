"use strict";

/*
 * Collects the arguments to a function into an array
 */
// zipArgs :: * -> [ * ]
const zipArgs = function() {
	/*
	 * Can't be an arrow function because of the way Node args work.
	 */
	return Array.prototype.slice.call(arguments)
}

module.exports = {
	zipArgs
}
