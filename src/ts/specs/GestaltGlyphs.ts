import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class GestaltGlyphs extends Technique {
	public static readonly DEFAULT_STROKE_WIDTH: number = 1;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = .5;
	public static readonly DEFAULT_RADIUS: number = 15;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("id", "black", "gray", GestaltGlyphs.DEFAULT_STROKE_WIDTH, GestaltGlyphs.DEFAULT_STROKE_WIDTH_EDGE, GestaltGlyphs.DEFAULT_RADIUS);
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.gestaltShape);
		this.lib.positionEdgeGlyphsGestalt();
		this.lib.positionNodeGlyphsMatrix();
		this.lib.setAttributes(GestaltGlyphs.DEFAULT_ATTR);
	}
}