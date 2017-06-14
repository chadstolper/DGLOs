import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("id", "grey", 10, 2, null, null));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts(null, "black", null, "1"));
		this.lib.runSimulation(true);
		this.lib.enableStepping();
	}
}