import { Technique } from "./Technique"
export class MatrixAnimated extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.positionEdgeGlyphsMatrix();
		this.lib.setNodeGlyphAttrs(this.opts);
		this.lib.setEdgeGlyphAttrs(this.opts);
		this.lib.enableStepping();
	}

}