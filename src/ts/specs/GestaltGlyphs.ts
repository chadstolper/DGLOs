import { Technique } from "./Technique";
import { SVGNodeAttrOpts, SVGEdgeAttrOpts } from "../lib/DGLOsSVG";

export class GestaltGlyphs extends Technique {
	public draw() {
		//this.lib.stopSimulation();
		//this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		//this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.gestaltShape);
		//this.lib.positionEdgeGlyphsMatrix();
		//this.lib.positionNodeGlyphsMatrix();
		//this.lib.setNodeGlyphAttrs(this.opts);
		this.lib.setEdgeGlyphAttrs(new SVGEdgeAttrOpts("blue", "black", 100, 20, 20)); //TODO: Will this might break your code.... -matt
	}
}