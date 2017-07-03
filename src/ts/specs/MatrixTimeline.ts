import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class MatrixTimeline extends Technique {
	public static readonly DEFAULT_STROKE_WIDTH = 0;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE = 1;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("id", "black", "blue", MatrixTimeline.DEFAULT_STROKE_WIDTH, MatrixTimeline.DEFAULT_STROKE_WIDTH_EDGE);
	public draw(): void {
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