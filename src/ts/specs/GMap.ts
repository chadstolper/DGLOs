import { Technique } from "./Technique";
import { SVGAttrOpts } from "../lib/DGLOsSVG";
import { SimulationAttrOpts } from "../lib/DGLOsSimulation";

export class GMap extends Technique {
	public static readonly DEFAULT_FILL: string = "type";
	public static readonly DEFAULT_STROKE: string = "grey";
	public static readonly DEFAULT_STROKE_EDGE: string = "black"
	public static readonly DEFAULT_STROKE_WIDTH: number = 2;
	public static readonly DEFAULT_STROKE_WIDTH_EDGE: number = 1;
	public static readonly DEFAULT_RADIUS: number = 10;
	public static readonly DEFAULT_ATTR: SVGAttrOpts = new SVGAttrOpts();
	public draw(): void {
		GMap.DEFAULT_ATTR.fill = GMap.DEFAULT_FILL
		GMap.DEFAULT_ATTR.stroke = GMap.DEFAULT_STROKE
		GMap.DEFAULT_ATTR.stroke_edge = GMap.DEFAULT_STROKE_EDGE
		GMap.DEFAULT_ATTR.stroke_width = GMap.DEFAULT_STROKE_WIDTH
		GMap.DEFAULT_ATTR.stroke_width_edge = GMap.DEFAULT_STROKE_WIDTH_EDGE
		GMap.DEFAULT_ATTR.radius = GMap.DEFAULT_RADIUS

		this.lib.drawNodeGlyphs();
		this.lib.drawEdgeGlyphs();
		this.lib.drawRegions();
		this.lib.drawTimesteps();
		this.lib.setRegionGlyphAttrs(GMap.DEFAULT_ATTR);
		this.lib.transformNodeGlyphsTo(this.lib.labelShape);
		this.lib.transformEdgeGlyphsTo(this.lib.sourceTargetLineShape);
		this.lib.transformGroupGlyphsTo(this.lib.voronoiShape);
		// this.lib.enableEnterExitColoring();
		this.lib.setSimulationAttrs(new SimulationAttrOpts());
		this.lib.enableStepping();
		this.lib.positionNodesAndEdgesForceDirected(true);
	}
}