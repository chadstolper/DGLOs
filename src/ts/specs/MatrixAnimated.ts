import { Technique } from "./Technique"
import { SVGNodeAttrOpts, SVGEdgeAttrOpts } from "../lib/DGLOsSVG"
import { NodeGlyphShape } from "../lib/NodeGlyphInterface";
import { EdgeGlyphShape } from "../lib/EdgeGlyphInterface";

import { RectGlyphShape } from "../lib/shapes/RectGlyphShape";
import { CircleGlyphShape } from "../lib/shapes/CircleGlyphShape";
import { LabelGlyphShape } from "../lib/shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "../lib/shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "../lib/shapes/GestaltGlyphShape";


export class MatrixAnimated extends Technique {
	public draw(): void {
		this.lib.drawNodeGlyphs();
		this.lib.setEdgeGlyphAttrs(new SVGEdgeAttrOpts("blue", "black", 1, 1500 / (this._library.data.timesteps[0].nodes.length - 1), 1500 / (this._library.data.timesteps[0].nodes.length - 1), null));
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.setNodeGlyphAttrs(new SVGNodeAttrOpts("pink", "black", null));
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
		this.lib.enableStepping();
	}

}