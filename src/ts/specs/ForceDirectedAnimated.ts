import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		let attr = new SVGAttrOpts("id", "black", 1, 1, 10, 2000, 2000);
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("id", "grey", 2, 0, 10, null, null, 100, "12pt"));
		this.lib.setEdgeGlyphAttrs(attr);
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}