import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/SVGAttrOpts";
import { SimulationAttrOpts } from "../lib/SVGSimulationAttrOpts";

export class ForceDirectedAnimated extends Technique {
	public static readonly DEFAULT_FILL: string = "id";
	public static readonly DEFAULT_STROKE: string = "grey";
	public static readonly DEFAULT_STROKE_EDGE: string = "black"
	public static readonly DEFAULT_STROKE_WIDTH: number = 2;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = 1;
	public static readonly DEFAULT_RADIUS: number = 10;
	public static readonly DEFAULT_FONT_SIZE: string = "16pt";
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();

	public static readonly DEFAULT_COLLISION_ENABLED: boolean = true;
	public static readonly DEFAULT_WEIGHT_ENABLED: boolean = false;
	public static readonly DEFAULT_SIM_ATTR: SimulationAttrOpts = new SimulationAttrOpts();
	public draw(): void {
		ForceDirectedAnimated.DEFAULT_ATTR.fill = ForceDirectedAnimated.DEFAULT_FILL
		ForceDirectedAnimated.DEFAULT_ATTR.stroke = ForceDirectedAnimated.DEFAULT_STROKE
		ForceDirectedAnimated.DEFAULT_ATTR.stroke_edge = ForceDirectedAnimated.DEFAULT_STROKE_EDGE
		ForceDirectedAnimated.DEFAULT_ATTR.stroke_width = ForceDirectedAnimated.DEFAULT_STROKE_WIDTH
		ForceDirectedAnimated.DEFAULT_ATTR.stroke_width_edge = ForceDirectedAnimated.DEFAULT_STROKE_WIDTH_EDGE
		ForceDirectedAnimated.DEFAULT_ATTR.radius = ForceDirectedAnimated.DEFAULT_RADIUS
		ForceDirectedAnimated.DEFAULT_ATTR.font_size = ForceDirectedAnimated.DEFAULT_FONT_SIZE;

		ForceDirectedAnimated.DEFAULT_SIM_ATTR.simulationCollisionEnabled = ForceDirectedAnimated.DEFAULT_COLLISION_ENABLED;
		ForceDirectedAnimated.DEFAULT_SIM_ATTR.simulationWeightEnabled = ForceDirectedAnimated.DEFAULT_WEIGHT_ENABLED;

		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.setAttributes(ForceDirectedAnimated.DEFAULT_ATTR);
		this.lib.setSimulationAttrs(ForceDirectedAnimated.DEFAULT_SIM_ATTR);
		this.lib.positionNodesAndEdgesForceDirected(true);
		this.lib.enableStepping();
	}
}