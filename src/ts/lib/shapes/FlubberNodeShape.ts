import { NodeShape } from "./NodeShape"
import { DGLOsSVGBaseClass } from "../DGLOsSVGBaseClass"
import { Selection } from "d3-selection"
import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface"
export class FlubberNodeShape extends NodeShape {
	constructor(lib: DGLOsSVGBaseClass) {
		super(lib);
	}
	protected transformTo(sourceSelection: Selection<any, {}, any, {}>, shape: NodeGlyphShape | EdgeGlyphShape, targetSelection: Selection<any, {}, any, {}>) {
		super.transformTo(sourceSelection, shape, targetSelection);
	}
}