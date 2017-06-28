import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG"

export class Egograph extends Technique {
	public draw() {
		let attr = new SVGAttrOpts("id", "none", 1, 1, 10, 2000, 2000);
		attr.font_size = "20";
		let attr2 = new SVGAttrOpts("blue", "black", 1, 1, 10, 2000, 2000);
		attr2.opacity = 75;
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.setCenterNode(this.lib.data.timesteps[0].nodes[0].origID);
		this.lib.fixCentralNodePositions(true);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setNodeGlyphAttrs(attr);
		this.lib.setEdgeGlyphAttrs(attr2);
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}