import { Shape } from '../../../../out/src/ts/lib/shapes/Shape';
import { EdgeGlyphShape } from '../EdgeGlyphInterface';
import { NodeGlyphShape } from '../NodeGlyphInterface';
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { SVGAttrOpts } from "../SVGAttrOpts";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20, scaleLinear, ScaleLinear, scalePoint, ScalePoint } from "d3-scale";
import { Selection } from "d3-selection"
import { extent } from "d3-array"

/**
 * The __GestaltGlyphsShape__ class contains all of the methods required to draw and position a Gestalt Glyph on screen.
 * The only attribute in the class is its __ _shapeType __ which is readonly. Shape types are used to coordinate 
 * transisitons between shapes.
 * 
 * The class implements __EdgeGlyphShape__ and as such must contain the following methods:
 * 	 *init()*, 
 * 	 *initDraw()*,
 * 	 *updateDraw()*, 
 * 	 *transformTo()*,
 *	 *draw()*, 
 */
export class GestaltGlyphShape extends Shape implements EdgeGlyphShape {
	readonly _shapeType = "Gestalt";
	private _thicknessScale: ScaleLinear<number, number>;
	private _weightScale: ScaleLinear<number, number>;
	private readonly PADDING_CONSTANT: number = 0.875;
	private _xAxisScale: ScalePoint<number>;
	private _yAxisScale: ScalePoint<number>;
	private readonly MIN_LINE_THICKNESS: number = 0.25;
	private readonly MAX_LINE_THICKNESS: number = 1.5;
	private readonly ANGLE_BOTTOM_BOUND: number = -10;
	private readonly ANGLE_TOP_BOUND: number = 10;

	/**
 	* The init method is a requirement of the __EdgeGlyphShape__ interface.
 	* 
 	* It takes an SVG selection and appends a <g> tag with class name GestaltGlyphs.
 	* This class is used to store the Gestalt Glyph objects.
 	* @param location
 	*/
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("GestaltGlyphs", true);
	}
	/**
	 * The initDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection with entered data and creates Gestalt Glyph objects with
	 * an ID based on the source and target of the edge.
	 * 
	 * The DynamicGraph and number parameteres are required by the interface but are not
	 * explicitly used here.
	 * @param glyphs 
	 */
	public initDraw(edges: Selection<any, Edge, any, {}>): Selection<any, {}, any, {}> {
		let ret: Selection<any, Edge, any, {}> = edges.append("line")
			.classed("edgeGestalt", true)
			.attr("id", function (d: Edge): string { return d.source.label + ":" + d.target.label })
			.attr("weight", function (d: Edge): string {
				return d.weight + "";
			})
			.attr("timestep", function (e: Edge): string {
				return e.timestep + "";
			});
		return ret;
	}

	/**
	 * Assign and/or update edge attributes
	 * @param edges 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number, svgWidth: number, svgHeight: number): Selection<any, {}, any, {}> {
		let self = this;
		try {
			glyphs
				.attr("x1", function (d: Edge) {
					return d.x;
				})
				.attr("y1", function (d: Edge) {
					let yPos = 0;
					for (let edge of data.timesteps[timeStampIndex].edges) {
						if (edge.target === d.source && edge.source === d.target && edge.timestep === d.timestep) {
							let yPos = self.weightScale(d.weight);
							d.y = yPos + d.y;
							break;
						}
					}
					return yPos + d.y;
				})
				.attr("x2", function (d: Edge) {
					return d.x + self.PADDING_CONSTANT * (svgWidth / data.timesteps[timeStampIndex].nodes.length);
				})
				.attr("y2", function (d: Edge) {
					let yPos = 0
					for (let edge of data.timesteps[timeStampIndex].edges) {
						if (edge.source === d.target && edge.target === d.source && edge.timestep === d.timestep) {
							let yPos = self.weightScale(edge.weight);
							if (yPos === NaN) {
								yPos = 0;
							}
							d.y = yPos + d.y;
							break;
						}
					}
					return yPos + d.y;
				})
				.attr("stroke", attrOpts.stroke_edge)
				.attr("stroke-width", function (d: Edge) {
					return self.thicknessScale(d.weight);
				});
			return glyphs;
		}
		catch (err) {
			console.log("gestalt update error");
		}
	}

	private initScales(data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts) {
		let self = this;
		this.weightScale = scaleLinear<number>()
			.domain(this.createDomain(data.timesteps[timeStampIndex].edges))
			.range([self.ANGLE_BOTTOM_BOUND, self.ANGLE_TOP_BOUND]);
		this.thicknessScale = scaleLinear<number>()
			.domain(this.createDomain(data.timesteps[timeStampIndex].edges))
			.range([self.MIN_LINE_THICKNESS, self.MAX_LINE_THICKNESS]);
		this.xAxisScale = scalePoint<number>()
			.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
			.range([(attrOpts.width - (attrOpts.width * this.PADDING_CONSTANT)), attrOpts.width])
			.padding(0.5);
		this.yAxisScale = scalePoint<number>()
			.domain(data.timesteps[timeStampIndex].nodes.map(function (d) { return d.index }))
			.range([attrOpts.height - (attrOpts.height * this.PADDING_CONSTANT), attrOpts.height])
			.padding(0.5);
	}

	set xAxisScale(scale: ScalePoint<number>) {
		this._xAxisScale = scale;
	}
	get xAxisScale(): ScalePoint<number> {
		return this._xAxisScale;
	}
	set yAxisScale(scale: ScalePoint<number>) {
		this._yAxisScale = scale;
	}
	get yAxisScale(): ScalePoint<number> {
		return this._yAxisScale;
	}
	/**
	 * Transform the current EdgeGlyphShape to given EdgeGlyphShape
	 * @param sourceG 
	 * @param targetShape 
	 * @param targetG 
	 */
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape | NodeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		switch (targetShape.shapeType) {
			case "Rect":
				console.log("Gestalt-->Rect");
				break;

			case "STLine":
				console.log("Gestalt-->STLine");
				break;

			case "Gestalt":
				console.log("Gestalt-->Gestalt Catch");
				break;

			default:
				console.log("Transition from", this.shapeType, "to ", targetShape.shapeType, "is unknown.");
		}
		super.transformTo(sourceG, null, targetG);
	}

	/**
	 * Draw and create new visualizations of edges, initial update included
	 * @param location
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts, svgWidth: number, svgHeight: number): void {
		this.initScales(data, timeStampIndex, attrOpts);
		let gestaltGlyphs = location.selectAll("line.edgeGestalt")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });

		gestaltGlyphs.exit().remove();

		let gestaltEnter = this.initDraw(gestaltGlyphs.enter());

		gestaltGlyphs = gestaltGlyphs.merge(gestaltEnter as Selection<any, Edge, any, {}>);

		this.updateDraw(gestaltGlyphs, attrOpts, data, timeStampIndex, svgWidth, svgHeight);
	}
	get shapeType(): string {
		return this._shapeType;
	}
	/**
 	* Create a domain based on the data and the weights of those edges in the data.
 	* @param edges 
 	*/
	public createDomain(edges: Array<Edge>) {
		return extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}
	set weightScale(scale: ScaleLinear<number, number>) {
		this._weightScale = scale;
	}
	get weightScale(): ScaleLinear<number, number> {
		return this._weightScale
	}
	set thicknessScale(scale: ScaleLinear<number, number>) {
		this._thicknessScale = scale;
	}
	get thicknessScale(): ScaleLinear<number, number> {
		return this._thicknessScale;
	}
}