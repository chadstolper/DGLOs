import { SVGAttrOpts, DGLOsSVG } from "../DGLOsSVG";
import { DGLOsSVGBaseClass } from "../DGLOsSVGBaseClass";
import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";

export class Shape {
	readonly _lib: DGLOsSVGBaseClass;
	constructor(lib: DGLOsSVGBaseClass) {
		this._lib = lib
	}

	protected transformTo(sourceSelection: Selection<any, {}, any, {}>, shape: NodeGlyphShape | EdgeGlyphShape, targetSelection: Selection<any, {}, any, {}>) {
		sourceSelection.transition().style("display", "none");
		targetSelection.transition().style("display", null);
	}
}