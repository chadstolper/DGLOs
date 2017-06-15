import { Technique } from "./Technique"
import { SVGAttrOpts } from "../lib/DGLOsSVG"
import { NodeGlyphShape } from "../lib/NodeGlyphInterface";
import { EdgeGlyphShape } from "../lib/EdgeGlyphInterface";

import { RectGlyphShape } from "../lib/shapes/RectGlyphShape";
import { CircleGlyphShape } from "../lib/shapes/CircleGlyphShape";
import { LabelGlyphShape } from "../lib/shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "../lib/shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "../lib/shapes/GestaltGlyphShape";


export class MatrixAnimated extends Technique {
	public draw(): void {
		console.log("MatrixAnimated");
		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.setEdgeGlyphAttrs(new SVGAttrOpts("blue", "black", null, 1, 1500 / (this._library.data.timesteps[0].nodes.length - 1), 1500 / (this._library.data.timesteps[0].nodes.length - 1), null));
		this.lib.setNodeGlyphAttrs(new SVGAttrOpts("pink", "black", null, 1, null, null));
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		//this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.enableStepping();
	}

}