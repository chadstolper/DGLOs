import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("id", "black", 10, 1, 1000, 1000, null));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts("blue", "black", 10, 1, 1000, 1000, null));
		this.lib.runSimulation(true);
		this.lib.enableStepping();
	}
}