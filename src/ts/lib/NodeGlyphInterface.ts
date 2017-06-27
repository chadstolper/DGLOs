import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph";
import { SVGAttrOpts } from "./DGLOsSVG";

export interface NodeGlyphShape {
	readonly shapeType: string;
	init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	initDraw(location: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}>;
	updateDraw(location: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}>;
	transformTo(source: Selection<any, {}, any, {}>, shape: NodeGlyphShape, target: Selection<any, {}, any, {}>): void;
	draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number, attrOpts: SVGAttrOpts, enterExit?: any): void;
}