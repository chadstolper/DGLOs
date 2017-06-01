import { Technique } from "./Technique"
import { SVGAttrOpts } from "../lib/DGLOsSVG";
export class MatrixAnimated extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		//this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		//this.lib.positionNodeGlyphsMatrix();
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		//this.lib.positionEdgeGlyphsMatrix();
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("purple", "grey", 10, 2));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts("blue", "black", null, null, 10, 10, null));
		//this.lib.enableStepping();
	}

}