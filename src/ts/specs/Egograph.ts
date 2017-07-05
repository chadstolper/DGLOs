import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/SVGAttrOpts";

export class Egograph extends Technique {
	public static readonly DEFAULT_FILL: string = "id";
	public static readonly DEFAULT_STROKE: string = "grey";
	public static readonly DEFAULT_STROKE_EDGE: string = "black"
	public static readonly DEFAULT_STROKE_WIDTH: number = 1;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = .5;
	public static readonly DEFAULT_RADIUS: number = 15;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();

	public draw(): void {
		Egograph.DEFAULT_ATTR.fill = Egograph.DEFAULT_FILL;
		Egograph.DEFAULT_ATTR.stroke = Egograph.DEFAULT_STROKE;
		Egograph.DEFAULT_ATTR.stroke_edge = Egograph.DEFAULT_STROKE_EDGE;
		Egograph.DEFAULT_ATTR.stroke_width = Egograph.DEFAULT_STROKE_WIDTH;
		Egograph.DEFAULT_ATTR.stroke_width_edge = Egograph.DEFAULT_STROKE_WIDTH_EDGE;
		Egograph.DEFAULT_ATTR.radius = Egograph.DEFAULT_RADIUS;

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