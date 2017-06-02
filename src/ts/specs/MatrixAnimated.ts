import { Technique } from "./Technique"
import { SVGAttrOpts } from "../lib/DGLOsSVG"
import { NodeGlyphShape, EdgeGlyphShape } from "../lib/DGLOs"
import { LabelGlyphShape, RectGlyphShape, SourceTargetLineGlyphShape, GestaltGlyphShape } from "../lib/ShapeClasses";

export class MatrixAnimated extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(new LabelGlyphShape("", "red", 0, 0));
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(new RectGlyphShape(0, 0, "white"));
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("purple", "grey", 10, 2));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts("blue", "black", null, null, 500 / this._library.data.timesteps[0].nodes.length, 500 / this._library.data.timesteps[0].nodes.length, null));
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
		//this.lib.enableStepping();
	}

}