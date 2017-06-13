/**
 * typings for https://github.com/veltman/flubber
 */
declare module "flubber" {

	/**
	* `fromShape` and `toShape` should each be a ring or an SVG path string. If your path string includes holes or multiple shapes in a single string, everything but the first outer shape will be ignored.
	* 
	* This returns a function that takes a value `t` from 0 to 1 and returns the in-between shape:
	* 
	* ```js
	* var interpolator = flubber.interpolate(triangle, octagon);
	* 
	* interpolator(0); // returns an SVG triangle path string
	* interpolator(0.5); // returns something halfway between the triangle and the octagon
	* interpolator(1); // returns an SVG octagon path string
	* ```
	* 
	* `options` can include the following keys:
	* 
	* `string`: whether to output results as an SVG path string or an array of points. (default: `true`)
	* `maxSegmentLength`: the lower this number is, the smoother the resulting animation will be, at the expense of performance. Represents a number in pixels (if no transforms are involved). Set it to `false` or `Infinity` for no smoothing. (default: `10`)
	*/
	function interpolate(fromShape: [number, number][] | string, toShape: [number, number][] | string, options?: InterpoloateOptions): string | [number, number][];


	interface InterpoloateOptions {
		string?: boolean;
		maxSegmentLength?: number;
	}

	/**
	* Like `interpolate()`, but for the specific case of transforming the shape to a circle centered at `[x, y]` with radius `r`.
	* 
	* ```js
	* var interpolator = flubber.toCircle(triangle, 100, 100, 10);
	* 
	* interpolator(0); // returns an SVG triangle path string
	* interpolator(0.5); // returns something halfway between the triangle and the circle
	* interpolator(1); // returns a circle path string centered at 100, 100 with a radius of 10
	* ```
	*/
	function toCircle(fromShape: [number, number][] | string, x: number, y: number, r: number, options?: InterpoloateOptions): string | [number, number][];

	/**
	* Like `interpolate()`, but for the specific case of transforming the shape to a rectangle with the upper-left corner `[x, y]` and the dimensions `width` x `height`.
	* 
	* ```js
	* var interpolator = flubber.toRect(triangle, 10, 50, 100, 200);
	* 
	* interpolator(0); // returns an SVG triangle path string
	* interpolator(0.5); // returns something halfway between the triangle and the rectangle
	* interpolator(1); // returns a rectangle path string from [10, 50] in the upper left to [110, 250] in the lower right
	* ```
	*/
	function toRect(fromShape: [number, number][] | string, x: number, y: number, width: number, height: number, options?: InterpoloateOptions): string | [number, number][];

	/**
	 * Like `toCircle()` but reversed.
	 */
	function fromCircle(x: number, y: number, r: number, toShape: [number, number][] | string, options?: InterpoloateOptions): [number, number][] | string;

	/**
	 * Like `toRect()` but reversed.
	 */
	function fromRect(x: number, y: number, width: number, height: number, toShape: [number, number][] | string, options?: InterpoloateOptions): [number, number][] | string;


	/**
	 * If you're trying to interpolate between a single shape and multiple shapes (for example, a group of three circles turning into a single big circle), this method will break your shapes into pieces so you can animate between the two sets.  This isn't terribly performant and has some quirks but it tends to get the job done.

	`fromShape` should be a ring or SVG path string, and `toShapeList` should be an array of them.

	The options are the same as for `interpolate()`, with the additional option of `single`, which defaults to `false`.

	If `single` is false, this returns an array of `n` interpolator functions, where `n` is the length of `toShapeList`.  If `single` is set to true this returns one interpolator that combines things into one giant path string or one big array of rings.

	```js
	// returns an array of two interpolator functions
	var interpolators = flubber.separate(triangle, [square, otherSquare]);

	d3.selectAll("path")
		.data(interpolators)
		.transition()
		.attrTween("d", function(interpolator) { return interpolator; });
	```

	```js
	// returns a single interpolator function
	var combinedInterpolator = flubber.separate(triangle, [square, otherSquare], { single: true });

	// This one path element will be two squares at the end
	d3.select("path")
		.transition()
		.attrTween("d", function() { return combinedInterpolator; });
	```
	 */
	function separate(fromShape: [number, number][] | string, toShapeList: [number, number][][] | string[], options?: SeparateOptions): [number, number][][] | string[];

	interface SeparateOptions extends InterpoloateOptions {
		single: boolean;
	}

	/**
	 * Like `separate()` but reversed.
	 */
	function combine(fromShapeList: [number, number][][] | string[], toShape: [number, number][] | string, options?: SeparateOptions): [number, number][] | string;

	/**
	 * A helper function for converting an array of points to an SVG path string.
	```js
	flubber.toPathString([[1, 1], [2, 1], [1.5, 2]]);
	// Returns "M1,1L2,1L1.5,2Z"
	```
	 */
	function toPathString(ring: [number, number][]): string;

	/**
	 * A helper function for splitting an SVG path string that might contain multiple shapes into an array of one-shape path strings.
	```js
	flubber.splitPathString("M1,1 L2,1 L1.5,2Z M3,3 L4,3 L3.5,4 Z");
	// Returns ["M1,1 L2,1 L1.5,2Z", "M3,3 L4,3 L3.5,4 Z"]
	```
	 */
	function splitPathString(pathString: string): string[];
}  