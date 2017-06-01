import { Technique } from "./Technique";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		// this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		// this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(this.opts);
		this.lib.setEdgeGlyphAttrs(this.opts);
		this.lib.runSimulation();
	}
}