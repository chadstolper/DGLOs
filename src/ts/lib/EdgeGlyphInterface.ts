import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph"
import { SVGAttrOpts } from "./SVGAttrOpts";
import { NodeGlyphShape } from "./NodeGlyphInterface";
export interface EdgeGlyphShape {
	readonly shapeType: string;
	init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	updateDraw(selection: Selection<any, {}, any, {}>, attr: SVGAttrOpts, data?: DynamicGraph, timeStampIndex?: number, svgWidth?: number, svgHeight?: number): Selection<any, {}, any, {}>;
	transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: NodeGlyphShape | EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void;
	draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, timeStampIndex: number, attr: SVGAttrOpts, svgWidth?: number, svgHeight?: number): void;
}