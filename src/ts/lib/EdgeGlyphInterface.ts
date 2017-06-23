import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph"
import { AttrOpts } from "./DGLOs";
export interface EdgeGlyphShape {
	readonly shapeType: string;
	init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	initDraw(selection: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}>;
	updateDraw(selection: Selection<any, {}, any, {}>, attr: AttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}>;
	transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void;
	draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number, attr: AttrOpts, enterExit?: any): void;
}