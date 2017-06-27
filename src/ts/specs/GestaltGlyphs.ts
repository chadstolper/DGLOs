import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class GestaltGlyphs extends Technique {
	public draw() {
		//this.lib.stopSimulation();
		//this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		//this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.gestaltShape);
		//this.lib.positionEdgeGlyphsMatrix();
		//this.lib.positionNodeGlyphsMatrix();
		//this.lib.setNodeGlyphAttrs(this.opts);
		// this.lib.setEdgeGlyphAttrs(new SVGAttrOpts("blue", "black", null, 100, 20, 20, null));
	}
}