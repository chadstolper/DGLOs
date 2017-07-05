import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class MatrixAnimated extends Technique {
	public static readonly DEFAULT_STROKE: string = "black";
	public static readonly DEFAULT_STROKE_EDGE: string = "grey"
	public static readonly DEFAULT_STROKE_WIDTH: number = 1;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = 0;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();
	public draw(): void {
		MatrixAnimated.DEFAULT_ATTR.stroke = MatrixAnimated.DEFAULT_STROKE
		MatrixAnimated.DEFAULT_ATTR.stroke_edge = MatrixAnimated.DEFAULT_STROKE_EDGE
		MatrixAnimated.DEFAULT_ATTR.stroke_width = MatrixAnimated.DEFAULT_STROKE_WIDTH
		MatrixAnimated.DEFAULT_ATTR.stroke_width_edge = MatrixAnimated.DEFAULT_STROKE_WIDTH_EDGE

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