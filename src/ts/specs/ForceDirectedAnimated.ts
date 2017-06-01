import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		// this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		// this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("purple", "grey", 10, 2));
		this.lib.setEdgeGlyphAttrs(this.opts);
		this.lib.runSimulation();
	}
}