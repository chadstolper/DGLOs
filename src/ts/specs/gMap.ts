import { Technique } from "./Technique"

export class GraphicMap extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs(); //require data as a graph
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(); //add string paramenter
		this.lib.transformEdgeGlyphsTo();
		this.lib.drawRegions(); //take color/fill
		this.lib.setNodeGlyphAttrs(); //radius, color, border
		this.lib.setEdgeGlyphAttrs(); //stroke, width
		this.lib.restartSimulation();
	}
}