import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG"

export class Egograph extends Technique {
	public draw() {
		let attr = new SVGAttrOpts("pink", "black", 10, 1, null, null, null);
		this.lib.setCenterNode(null);
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(attr);
		this.lib.setEdgeGlyphAttrs(attr);
		this.lib.runSimulation();
	}
}