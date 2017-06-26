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
		let attr = new SVGAttrOpts("id", "black", 1, 1, 10, 2000, 2000);
		let attr2 = new SVGAttrOpts("blue", "black", 1, 1, 10, 2000, 2000);
		this.lib.drawNodeGlyphs();
		this.lib.setEdgeGlyphAttrs(attr2);
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.drawEdgeGlyphs();
		this.lib.transformEdgeGlyphsTo(this.lib.rectShape);
		this.lib.setNodeGlyphAttrs(attr);
		this.lib.positionNodeGlyphsMatrix();
		this.lib.positionEdgeGlyphsMatrix();
		this.lib.enableStepping();
	}

}