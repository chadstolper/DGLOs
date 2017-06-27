import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class MatrixTimeline extends Technique {
	public draw(): void {
		let attr = new SVGAttrOpts("id", "black", 1, 1, 10, 2000, 2000);
		let attr2 = new SVGAttrOpts("blue", "black", 1, 1, 10, 2000, 2000);
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setNodeGlyphAttrs(attr);
		this.lib.setEdgeGlyphAttrs(attr2);
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
	}

}