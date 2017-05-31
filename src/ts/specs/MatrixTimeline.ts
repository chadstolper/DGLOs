import { Technique } from "./Technique"

export class MatrixTimeline extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(/*"label"*/);
		this.lib.positionNodeGlyphsMatrix(/*x-axis*/);
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.positionEdgeGlyphsMatrix();
		this.lib.setNodeGlyphAttrs();
		this.lib.setEdgeGlyphAttrs();
		this.lib.replicateTimesteps();
	}

}