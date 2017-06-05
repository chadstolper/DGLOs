import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph"
export interface EdgeGlyphShape {
	readonly shapeType: string;
	init(location: Selection<any, {}, any, {}>): void;
	initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	updateDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	transformTo(shape: EdgeGlyphShape): EdgeGlyphShape;
	draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number): void;
}