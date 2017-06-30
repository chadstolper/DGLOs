import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class MatrixAnimated extends Technique {
	public static readonly DEFAULT_STROKE_WIDTH: number = 1;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = .5;
	public static readonly DEFAULT_RADIUS: number = 15;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("id", "black", "gray", MatrixAnimated.DEFAULT_STROKE_WIDTH, MatrixAnimated.DEFAULT_STROKE_WIDTH_EDGE, MatrixAnimated.DEFAULT_RADIUS);
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.enableStepping();
		this.lib.setAttributes(MatrixAnimated.DEFAULT_ATTR);
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
	}
}