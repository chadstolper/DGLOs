import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class GMap extends Technique {
	public draw() {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.drawRegions();
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("grey", null, 1));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts(null, "grey", null, 1));
		this.lib.setRegionGlyphAttrs(new SVGAttrOpts("type", "black"));
		this.lib.enableStepping();
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}