import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph"
import { SVGAttrOpts, SimulationAttrOpts } from "./DGLOsSVG";
export interface EdgeGlyphShape {
	readonly shapeType: string;
	init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	initDraw(selection: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}>;
	updateDraw(selection: Selection<any, {}, any, {}>, attr: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number, svgWidth: number, svgHeight: number): Selection<any, {}, any, {}>;
	transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void;
	draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number, attr: SVGAttrOpts, svgWidth: number, svgHeight: number, enterExit?: any): void;
}