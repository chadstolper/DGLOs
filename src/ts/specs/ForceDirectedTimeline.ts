import { Technique } from "./Technique"
import { SVGAttrOpts, SimulationAttrOpts } from "../lib/DGLOsSVG";

export class ForceDirectedTimeline extends Technique {
	//public static readonly FDT_DEFAULT_ATTR =  new SVGAttrOpts("id", "black", "gray", 1, .5, 15, 2000, 2000);
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("id", "grey", "black", 2, 1, 10, null, null, 100, "12pt");
	public draw(): void {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setAttributes(ForceDirectedTimeline.DEFAULT_ATTR);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.setSimulationAttrs(new SimulationAttrOpts());
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}