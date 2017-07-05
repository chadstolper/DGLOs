import { Selection } from "d3-selection";
import { DynamicGraph } from "../model/DynamicGraph";
import { SVGAttrOpts } from "./SVGAttrOpts";
export interface GroupGlyph {
	readonly groupType: string;
	init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}>;
	updateDraw(selection: Selection<any, {}, any, {}>, attr: SVGAttrOpts): Selection<any, {}, any, {}>;
	transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: GroupGlyph, targetG: Selection<any, {}, any, {}>): void;
	draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number, attr: SVGAttrOpts, noisePoints?: any, voronoiData?: any, enterExit?: any): void;
}