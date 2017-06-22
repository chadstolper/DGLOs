import { Technique } from "./Technique";
import { SVGNodeAttrOpts, SVGEdgeAttrOpts } from "../lib/DGLOsSVG";

export class MatrixTimeline extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setNodeGlyphAttrs(new SVGNodeAttrOpts("black", "black", 1));
		this.lib.setEdgeGlyphAttrs(new SVGEdgeAttrOpts("blue", "black", 1, 1500 / (this._library.data.timesteps[0].nodes.length - 1), 1500 / (this._library.data.timesteps[0].nodes.length - 1), null));
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
	}

}