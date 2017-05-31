import { Technique } from "./Technique"
export class MatrixAnimated extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(/*"label"*/);
		this.lib.positionNodeGlyphsMatrix(/*x-axis*/);
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(/*rect*/);
		this.lib.positionEdgeGlyphsMatrix();
		this.lib.setNodeGlyphAttrs();
		this.lib.setEdgeGlyphAttrs();
		this.lib.enableStepping();
	}

}