import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph";

export interface NodeGlyphShape {
	readonly shapeType: string;

	init(location: Selection<any, {}, any, {}>): void;
	//TODO: Make new <g>
	initDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	//
	updateDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	transformTo(shape: NodeGlyphShape): NodeGlyphShape;
	draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number): void;
	//TODO: .data(data.timestep[timestepindex]).enter().call(initDraw(location))
}