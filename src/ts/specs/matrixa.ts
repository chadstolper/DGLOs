import { Technique } from "./Technique"
export class MatrixA extends Technique {
	public draw(): void {
		this.lib.drawNewNodeGlyphs();
		this.lib.transformNodeGlyphsTo(/*"label"*/);
		this.lib.positionNodeGlyphs(/*x-axis*/);
	}

}