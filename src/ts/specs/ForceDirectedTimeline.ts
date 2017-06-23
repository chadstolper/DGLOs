import { Technique } from "./Technique"
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedTimeline extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("id", "grey", 2, 0, 10, null, null, 100, "12pt"));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts(null, "black", 1));
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		// this.lib.enableEnterExitColoring();
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}