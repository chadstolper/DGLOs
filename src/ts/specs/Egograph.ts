import { Technique } from "./Technique";
import { SVGNodeAttrOpts, SVGEdgeAttrOpts } from "../lib/DGLOsSVG"

export class Egograph extends Technique {
	public draw() {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.setCenterNode(this.lib.data.timesteps[0].nodes[0].origID);
		this.lib.fixCentralNodePositions(true);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(new SVGNodeAttrOpts("id", "black", 1, 10));
		this.lib.setEdgeGlyphAttrs(new SVGEdgeAttrOpts(null, "black", 1));
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}