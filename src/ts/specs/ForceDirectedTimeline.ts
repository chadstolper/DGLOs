import { Technique } from "./Technique"
import { SVGNodeAttrOpts, SVGEdgeAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedTimeline extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setNodeGlyphAttrs(new SVGNodeAttrOpts("id", "grey", 2, 0, 10));
		this.lib.setEdgeGlyphAttrs(new SVGEdgeAttrOpts(null, "black", 1));
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}