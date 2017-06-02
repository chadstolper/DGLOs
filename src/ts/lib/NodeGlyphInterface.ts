import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph";

export interface NodeGlyphShape {
	readonly shapeType: string;

	init(location: Selection<any, {}, any, {}>): void;
	//TODO: Make new <g>
	initDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	//TODO: draw nodes
	updateDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	//TODO: position and add attr
	transformTo(shape: NodeGlyphShape): NodeGlyphShape;
	//TODO: says what it does on the tin
	draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number): void;
	//TODO: .data(data.timestep[timestepindex]).enter().call(initDraw(location))
}