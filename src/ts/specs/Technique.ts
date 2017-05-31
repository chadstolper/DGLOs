import { DynamicGraph } from "../model/DynamicGraph";

export interface Technique {
	data(data: DynamicGraph): Technique;
	location(loc: Selection): Technique;
	options(args: any): Technique;
	draw(): Technique;
}