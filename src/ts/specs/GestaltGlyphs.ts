import { Technique } from "./Technique";

export class GestaltGlyphs extends Technique {
	public draw() {
		this.lib.stopSimulation();
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionEdgeGlyphsGestalt();
		this.lib.positionNodeGlyphsMatrix();
		this.lib.setNodeGlyphAttrs(this.opts);
		this.lib.setEdgeGlyphAttrs(this.opts);
	}
}