import { Technique } from "./Technique";

export class GestaltGlyphs extends Technique {
	public draw() {
		this.lib.runSimulation(true);
		this.lib.runSimulation(false);
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.gestaltShape);
		this.lib.positionEdgeGlyphsMatrix();
		this.lib.positionNodeGlyphsMatrix();
		this.lib.setNodeGlyphAttrs(this.opts);
		this.lib.setEdgeGlyphAttrs(this.opts);
	}
}