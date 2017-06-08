import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG"

export class Egograph extends Technique {
	public draw() {
		let attr = new SVGAttrOpts("gold", "black", 10, 1);
		this.lib.setCenterNode(this.lib.data.timesteps[0].nodes[0].origID);

		//this.lib.drawNodeGlyphs();
		//this.lib.drawEdgeGlyphs();
		//this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		//this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		//this.lib.setNodeGlyphAttrs(attr);
		//this.lib.setEdgeGlyphAttrs(attr);
		//this.lib.runSimulation();
	}
}