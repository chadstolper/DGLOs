import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class GestaltGlyphs extends Technique {
	public draw() {
		let attr = new SVGAttrOpts("id", "black", "gray", 1, .5, 15, 2000, 2000);
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.gestaltShape);
		this.lib.positionEdgeGlyphsGestalt();
		this.lib.positionNodeGlyphsMatrix();
		this.lib.setAttributes(attr);
	}
}