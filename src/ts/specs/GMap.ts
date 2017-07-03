import { Technique } from "./Technique";
import { SVGAttrOpts, SimulationAttrOpts } from "../lib/DGLOsSVG";

export class GMap extends Technique {
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("type", "black", "grey");
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawRegions();
		this.lib.drawTimesteps();
		this.lib.setRegionGlyphAttrs(GMap.DEFAULT_ATTR);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.transformGroupGlyphsTo(this.lib.voronoiShape);
		// this.lib.enableEnterExitColoring();
		this.lib.setSimulationAttrs(new SimulationAttrOpts());
		this.lib.enableStepping();
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}