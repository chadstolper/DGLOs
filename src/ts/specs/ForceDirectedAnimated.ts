import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";
import { SimulationAttrOpts } from "../lib/DGLOsSimulation";

export class ForceDirectedAnimated extends Technique {
	public static readonly DEFAULT_FILL: string = "id";
	public static readonly DEFAULT_STROKE: string = "grey";
	public static readonly DEFAULT_STROKE_EDGE: string = "black"
	public static readonly DEFAULT_STROKE_WIDTH: number = 2;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = 1;
	public static readonly DEFAULT_RADIUS: number = 10;
	public static readonly DEFAULT_FONT_SIZE: string = "16pt";
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();
	public draw(): void {
		ForceDirectedAnimated.DEFAULT_ATTR.fill = ForceDirectedAnimated.DEFAULT_FILL
		ForceDirectedAnimated.DEFAULT_ATTR.stroke = ForceDirectedAnimated.DEFAULT_STROKE
		ForceDirectedAnimated.DEFAULT_ATTR.stroke_edge = ForceDirectedAnimated.DEFAULT_STROKE_EDGE
		ForceDirectedAnimated.DEFAULT_ATTR.stroke_width = ForceDirectedAnimated.DEFAULT_STROKE_WIDTH
		ForceDirectedAnimated.DEFAULT_ATTR.stroke_width_edge = ForceDirectedAnimated.DEFAULT_STROKE_WIDTH_EDGE
		ForceDirectedAnimated.DEFAULT_ATTR.radius = ForceDirectedAnimated.DEFAULT_RADIUS
		ForceDirectedAnimated.DEFAULT_ATTR.font_size = ForceDirectedAnimated.DEFAULT_FONT_SIZE;

		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setAttributes(ForceDirectedAnimated.DEFAULT_ATTR);
		this.lib.setSimulationAttrs(new SimulationAttrOpts(true, true));
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}