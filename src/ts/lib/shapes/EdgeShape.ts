import { DGLOsSVGBaseClass } from "../DGLOsSVGBaseClass"
import { Selection } from "d3-selection"
import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface"
export class EdgeShape {
	private readonly _lib: DGLOsSVGBaseClass;
	constructor(lib: DGLOsSVGBaseClass) {
		this._lib = lib
	}
	get lib(): DGLOsSVGBaseClass {
		return this._lib
	}
	protected transformTo(shape: NodeGlyphShape | EdgeGlyphShape) {
		console.log("EdgeShape transfromTo");
	}
}