import { Technique } from "./Technique"
export class MatrixT extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(/*"label"*/);
		this.lib.positionNodeGlyphsMatrix(/*x-axis*/);
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(/*rect*/);
		this.lib.positionEdgeGlyphsMatrix();
		this.lib.replicateTimesteps();
	}

}