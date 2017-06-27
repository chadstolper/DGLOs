import { Technique } from "./Technique";
import { SVGAttrOpts, SimulationAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("id", "grey", 2, 0, 10, null, null, 100, "16pt"));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts(null, "black", 1, 0));
		this.lib.setSimulationAttrs(new SimulationAttrOpts());
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}