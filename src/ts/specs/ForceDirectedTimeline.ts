import { Technique } from "./Technique"
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedTimeline extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawTimesteps();
		// this.lib.drawNewNodeGlyphs();
		// this.lib.drawNewEdgeGlyphs();
		// this.lib.removeExitNodeGlyphs();
		// this.lib.removeExitEdgeGlyphs();
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("id", "grey", 10, 2, null, null));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts(null, "black", null, "1"));
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.runSimulation(true);
	}
}