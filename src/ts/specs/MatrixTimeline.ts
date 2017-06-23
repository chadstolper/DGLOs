import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";

export class MatrixTimeline extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("black", "black", 0));
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts("blue", "black", 1, 0, null, 1500 / (this._library.data.timesteps[0].nodes.length - 1), 1500 / (this._library.data.timesteps[0].nodes.length - 1), null));
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
	}

}