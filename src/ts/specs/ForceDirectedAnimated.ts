import { Technique } from "./Technique";
import { SVGEdgeAttrOpts, SVGNodeAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGNodeAttrOpts("id", "grey", 2, 0, 10));
		this.lib.setEdgeGlyphAttrs(new SVGEdgeAttrOpts(null, "black", 1));
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}