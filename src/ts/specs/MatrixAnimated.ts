import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class MatrixAnimated extends Technique {
	public draw(): void {
		let attr = new SVGAttrOpts("id", "black", "blue", 1, .5, 15, 2000, 2000);
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.enableStepping();
		this.lib.setAttributes(attr);
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
	}
}