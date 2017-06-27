import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG"

export class Egograph extends Technique {
	public draw() {
		let attr = new SVGAttrOpts("id", null, "black", 0, 1, 10);
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.setCenterNode(this.lib.data.timesteps[0].nodes[0].origID);
		this.lib.fixCentralNodePositions(true);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setAttributes(attr);
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}