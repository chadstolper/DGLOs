// main.ts
// https://blog.mariusschulz.com/2016/06/27/bundling-es2015-modules-with-typescript-and-rollup
import { square, cube } from "./math";
import * as d3 from "d3-selection"
 
d3.select("h3").text("Trying something else!");
console.log(square(3));