import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class GMap extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawRegions();
		this.lib.drawTimesteps();
		this.lib.setRegionGlyphAttrs(new SVGAttrOpts("id", "black", "grey"));
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.transformGroupGlyphsTo(this.lib.voronoiShape);
		// this.lib.enableEnterExitColoring();
		this.lib.enableStepping();
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}