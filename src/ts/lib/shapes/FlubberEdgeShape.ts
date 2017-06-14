import { EdgeShape } from "./EdgeShape"
import { DGLOsSVGBaseClass } from "../DGLOsSVGBaseClass"
import { Selection } from "d3-selection"
import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface"
export class FlubberEdgeShape extends EdgeShape {
	constructor(lib: DGLOsSVGBaseClass) {
		super(lib);
	}
	protected transformTo(shape: NodeGlyphShape | EdgeGlyphShape) {
		super.transformTo(shape);
	}
} 