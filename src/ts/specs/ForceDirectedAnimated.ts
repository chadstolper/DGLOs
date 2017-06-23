import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("id", "grey", 2, 0, 10, null, null, 100, "12pt"));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts(null, "black", 1, 0));
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}