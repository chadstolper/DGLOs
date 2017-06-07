import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { AttrOpts } from "../DGLOs"
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

/**
 * LineGlyphShape implements __EdgeGlyphShape__.
 * 
 * LineGlyphShape is a superClass for GestaltGlyphShape and SourceTargetLineGlyphShape. It
 * has zero functionality at this point!
 */
export abstract class LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType: string;

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public initDraw(selection: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		return null;
	}
	public updateDraw(selection: Selection<any, {}, any, {}>, attr: AttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		return null;
	}
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		return null;
	}
	public draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number, attr: AttrOpts): void {
		return null;
	}

	get shapeType(): string {
		return this._shapeType;
	}
}
