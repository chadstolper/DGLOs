// math.ts
//https://blog.mariusschulz.com/2016/06/27/bundling-es2015-modules-with-typescript-and-rollup
export function square(x: number) {
	// return Math.pow(x, 2);
	return x ** 2;
}

export function cube(x: number) {
	return x ** 3;
	// return Math.pow(x, 3);
}
