import { Technique } from "./Technique"

export class MatrixTimeline extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.drawTimesteps();
		this.lib.setNodeGlyphAttrs(this.opts);
		this.lib.setEdgeGlyphAttrs(this.opts);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
	}

}