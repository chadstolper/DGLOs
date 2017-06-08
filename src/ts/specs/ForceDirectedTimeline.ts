import { Technique } from "./Technique"

export class ForceDirectedTimeline extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.replicateTimesteps();
		this.lib.drawNewNodeGlyphs();
		this.lib.drawNewEdgeGlyphs();
		this.lib.removeExitNodeGlyphs();
		this.lib.removeExitEdgeGlyphs();
		this.lib.setNodeGlyphAttrs(this.opts);
		this.lib.setEdgeGlyphAttrs(this.opts);
		this.lib.runSimulation(true);
	}
}