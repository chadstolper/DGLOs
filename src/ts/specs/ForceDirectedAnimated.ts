import { Technique } from "./Technique";
import { SVGAttrOpts, SimulationAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedAnimated extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setAttributes(new SVGAttrOpts("id", "grey", "black", 2, 1, 10, null, null, 100, "16pt"));
		this.lib.setSimulationAttrs(new SimulationAttrOpts());
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}