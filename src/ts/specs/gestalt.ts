import { Technique } from "./Technique";

export class GestaltGlyph extends Technique {
	public draw() {
		this.lib.stopSimulation();
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo("label");
		this.lib.positionEdgeGlyphsGestalt();
		this.lib.positionNodeGlyphsGestalt();
		this.lib.setNodeGlyphAttrs();
		this.lib.setEdgeGlyphAttrs()
	}
}