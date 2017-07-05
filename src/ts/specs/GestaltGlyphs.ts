import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class GestaltGlyphs extends Technique {
	public static readonly DEFAULT_FILL: string = "id";
	public static readonly DEFAULT_STROKE: string = "black";
	public static readonly DEFAULT_STROKE_EDGE: string = "grey"
	public static readonly DEFAULT_STROKE_WIDTH: number = 1;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = .5;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();
	public draw(): void {
		GestaltGlyphs.DEFAULT_ATTR.fill = GestaltGlyphs.DEFAULT_FILL
		GestaltGlyphs.DEFAULT_ATTR.stroke = GestaltGlyphs.DEFAULT_STROKE
		GestaltGlyphs.DEFAULT_ATTR.stroke_edge = GestaltGlyphs.DEFAULT_STROKE_EDGE
		GestaltGlyphs.DEFAULT_ATTR.stroke_width = GestaltGlyphs.DEFAULT_STROKE_WIDTH
		GestaltGlyphs.DEFAULT_ATTR.stroke_width_edge = GestaltGlyphs.DEFAULT_STROKE_WIDTH_EDGE
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.gestaltShape);
		this.lib.positionEdgeGlyphsGestalt();
		this.lib.positionNodeGlyphsMatrix();
		this.lib.setAttributes(GestaltGlyphs.DEFAULT_ATTR);
	}
}