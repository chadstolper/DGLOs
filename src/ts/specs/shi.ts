import { Technique } from "./Technique";

export class EgoGraph extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(/*circle*/);
		this.lib.transformEdgeGlyphsTo(/*line*/);
		this.lib.setNodeGlyphAttrs();
		this.lib.setEdgeGlyphAttrs();
		this.lib.restartSimulation();
	}
}