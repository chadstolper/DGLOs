import { NodeShape } from "./NodeShape"
export class LabelShape extends NodesShape {
	private readonly _lib: DGLOsSVGBaseClass;
	constructor(lib: DGLOsSVGBaseClass) {
		this._lib = lib
	}

	protected transformTo(sourceSelection: Selection<any, {}, any, {}>, shape: NodeGlyphShape | EdgeGlyphShape, targetSelection: Selection<any, {}, any, {}>) {
		sourceSelection.transition().style("display", "none");
		targetSelection.transition().style("display", null);
	}
	public get lib(): DGLOsSVGBaseClass {
		return this._lib;
	}
}