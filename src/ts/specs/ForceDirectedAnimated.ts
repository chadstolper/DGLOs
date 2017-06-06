import { Technique } from "./Technique";
import { CircleGlyphShape, SourceTargetLineGlyphShape, LabelGlyphShape } from "../lib/ShapeClasses"
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(new CircleGlyphShape(10, "purple", "grey", 2));
		this.lib.transformEdgeGlyphsTo(new SourceTargetLineGlyphShape("grey", 1));
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("purple", "grey", 10, 2));
		// this.lib.setEdgeGlyphAttrs(new SVGAttrOpts(null, "black", null, 1));
		this.lib.runSimulation();
	}
}