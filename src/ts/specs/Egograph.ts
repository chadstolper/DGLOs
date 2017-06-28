import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG"

export class Egograph extends Technique {
	public draw() {
		let attr = new SVGAttrOpts("id", "black", "gray", 1, .5, 15, 2000, 2000);
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.setCenterNode(this.lib.data.timesteps[0].nodes[0].origID);
		this.lib.fixCentralNodePositions(true);
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setAttributes(attr);
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}