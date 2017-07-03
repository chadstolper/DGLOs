import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class MatrixTimeline extends Technique {
	public static readonly DEFAULT_STROKE: string = "black";
	public static readonly DEFAULT_STROKE_EDGE: string = "grey"
	public static readonly DEFAULT_STROKE_WIDTH: number = 1;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = .5;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();
	public draw(): void {
		MatrixTimeline.DEFAULT_ATTR.stroke = MatrixTimeline.DEFAULT_STROKE
		MatrixTimeline.DEFAULT_ATTR.stroke_edge = MatrixTimeline.DEFAULT_STROKE_EDGE
		MatrixTimeline.DEFAULT_ATTR.stroke_width = MatrixTimeline.DEFAULT_STROKE_WIDTH
		MatrixTimeline.DEFAULT_ATTR.stroke_width_edge = MatrixTimeline.DEFAULT_STROKE_WIDTH_EDGE
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setAttributes(MatrixTimeline.DEFAULT_ATTR);
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
	}
}