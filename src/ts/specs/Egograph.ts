import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG"

export class Egograph extends Technique {
	public static readonly DEFAULT_STROKE_WIDTH: number = 1;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = .5;
	public static readonly DEFAULT_RADIUS: number = 15;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts("id", "black", "gray", Egograph.DEFAULT_STROKE_WIDTH, Egograph.DEFAULT_STROKE_WIDTH_EDGE, Egograph.DEFAULT_RADIUS);

	public draw(): void {
		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.setCenterNode(this.lib.data.timesteps[0].nodes[0].origID);
		this.lib.fixCentralNodePositions(true);
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setAttributes(Egograph.DEFAULT_ATTR);
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}