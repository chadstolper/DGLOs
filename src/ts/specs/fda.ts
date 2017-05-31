import { Technique } from "./Technique";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs(); //require data as a graph
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(); //add string paramenter
		this.lib.transformEdgeGlyphsTo();
		this.lib.setNodeGlyphAttrs(); //radius, color, border
		this.lib.setEdgeGlyphAttrs(); //stroke, width
		this.lib.restartSimulation();
	}
}