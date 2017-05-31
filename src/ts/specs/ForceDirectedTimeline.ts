import { Technique } from "./Technique"

export class ForceDirectedTimeline extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs(); //require data as a graph
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(); //add string paramenter
		this.lib.transformEdgeGlyphsTo();
		this.lib.replicateTimesteps();
		this.lib.drawNewNodeGlyphs();
		this.lib.drawNewEdgeGlyphs();
		this.lib.removeExitNodeGlyphs();
		this.lib.removeExitEdgeGlyphs();
		this.lib.setNodeGlyphAttrs(); //radius, color, border
		this.lib.setEdgeGlyphAttrs(); //stroke, width
		this.lib.restartSimulation();
	}
}