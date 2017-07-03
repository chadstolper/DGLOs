import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";
import { SimulationAttrOpts } from "../lib/DGLOsSimulation";

export class ForceDirectedAnimated extends Technique {
	// public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("id", "black", "gray", 1, .5, 15, 2000, 2000);
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("id", "grey", "black", 2, 1, 10, null, null, 100, "16pt")
	public draw(): void {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setAttributes(ForceDirectedAnimated.DEFAULT_ATTR);
		this.lib.setSimulationAttrs(new SimulationAttrOpts(true, true));
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}