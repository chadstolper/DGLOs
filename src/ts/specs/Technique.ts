import { DynamicGraph } from "../model/DynamicGraph";
import { Selection } from "d3-selection";

export interface Technique {
	data(data: DynamicGraph): Technique;
	location(loc: Selection<any, {}, any, {}>): Technique;
	options(args: any): Technique;
	draw(): Technique;
}