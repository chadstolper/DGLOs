import { Technique } from "./Technique"
import { SVGAttrOpts } from "../lib/SVGAttrOpts";
import { SimulationAttrOpts } from "../lib/SVGSimulationAttrOpts";

export class ForceDirectedTimeline extends Technique {
	public static readonly DEFAULT_FILL: string = "enterExit";
	public static readonly DEFAULT_STROKE: string = "grey";
	public static readonly DEFAULT_STROKE_EDGE: string = "black"
	public static readonly DEFAULT_STROKE_WIDTH: number = 2;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = 1;
	public static readonly DEFAULT_RADIUS: number = 10;
	public static readonly DEFAULT_FONT_SIZE: string = "12pt";
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();
	public static readonly DEFAULT_SIMULATION_ATTR: SimulationAttrOpts = new SimulationAttrOpts();
	public static readonly DEFAULT_COLLISION: boolean = true;
	public draw(): void {
		ForceDirectedTimeline.DEFAULT_ATTR.fill = ForceDirectedTimeline.DEFAULT_FILL
		ForceDirectedTimeline.DEFAULT_ATTR.stroke = ForceDirectedTimeline.DEFAULT_STROKE
		ForceDirectedTimeline.DEFAULT_ATTR.stroke_edge = ForceDirectedTimeline.DEFAULT_STROKE_EDGE
		ForceDirectedTimeline.DEFAULT_ATTR.stroke_width = ForceDirectedTimeline.DEFAULT_STROKE_WIDTH
		ForceDirectedTimeline.DEFAULT_ATTR.stroke_width_edge = ForceDirectedTimeline.DEFAULT_STROKE_WIDTH_EDGE
		ForceDirectedTimeline.DEFAULT_ATTR.radius = ForceDirectedTimeline.DEFAULT_RADIUS
		ForceDirectedTimeline.DEFAULT_ATTR.font_size = ForceDirectedTimeline.DEFAULT_FONT_SIZE;
		ForceDirectedTimeline.DEFAULT_SIMULATION_ATTR.simulationCollisionEnabled = ForceDirectedTimeline.DEFAULT_COLLISION;

		this.lib.drawEdgeGlyphs();
		this.lib.drawNodeGlyphs();
		this.lib.drawTimesteps();
		this.lib.setAttributes(ForceDirectedTimeline.DEFAULT_ATTR);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.transformNodeGlyphsTo(this.lib.circleShape);
		this.lib.setSimulationAttrs(ForceDirectedTimeline.DEFAULT_SIMULATION_ATTR);
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}