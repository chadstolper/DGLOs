import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { extent } from "d3-array";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { LineGlyphShape } from "./LineGlyphShape";
import { SVGAttrOpts } from "../DGLOsSVG";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20, scaleLinear } from "d3-scale";

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
export class GestaltGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Gestalt";

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
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public initDraw(edges: Selection<any, Edge, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		let self = this;
		let ret: Selection<any, Edge, any, {}> = edges.append("line")
			.classed("edgeGestalt", true)
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id })
			.attr("weight", function (d: Edge): string {
				return d.weight + "";
			})
		// FIX
		// .on("click", function (d: Node) {
		// 	console.log(d.origID);
		// 	self._lib._centralNodeID = d.origID;
		// });
		return ret;
	}

	/**
	 * Assign and/or update edge attributes
	 * @param edges 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		try {
			let weightScale = scaleLinear<number>()
				.domain(this.createDomain(data.timesteps[TimeStampIndex].edges))
				.range([0, 45])
			let steps = data.timesteps.length;
			let index = TimeStampIndex;
			for (let i = 0; i < steps; i++) {
				glyphs
					.attr("x1", function (d: Edge) {
						return d.source.index / data.timesteps[index].nodes.length * 1000;
					})
					.attr("y1", function (d: Edge) {
						return (d.target.index / data.timesteps[index].nodes.length * 1000) + 25;
					})
					.attr("x2", function (d: Edge) {
						return (d.source.index / data.timesteps[index].nodes.length * 1000) + 50;
					})
					.attr("y2", function (d: Edge) {
						if (Math.tan(weightScale(d.weight)) < 0) {
							console.log("negative");
							return 75 * (d.target.index) + (-1 * Math.tan(weightScale(d.weight)));
						} else {
							console.log("positive");
							return 75 * (d.target.index) + (Math.tan(weightScale(d.weight)));
						}
					})
					.attr("stroke", attrOpts.stroke)
					.attr("stroke-width", attrOpts.stroke_width);
				index += 1;
			}

			return glyphs;
		}

	/**
	 * Transform the current EdgeGlyphShape to given EdgeGlyphShape
	 * @param sourceG 
	 * @param targetShape 
	 * @param targetG 
	 */
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
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
		};
		super.transformTo(sourceG, targetShape, targetG);
	}

	/**
	 * Draw and create new visualizations of edges, initial update included
	 * @param gestaltG Should be the gestaltG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(gestaltG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts): void {
		console.log("drawingGestalt");
		let gestaltGlyphs = gestaltG.selectAll("line.edgeGestalt")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });

		gestaltGlyphs.exit().remove();

		let gestaltEnter = this.initDraw(gestaltGlyphs.enter(), data, timeStampIndex);

		gestaltGlyphs = gestaltGlyphs.merge(gestaltEnter as Selection<any, Edge, any, {}>);

		this.updateDraw(gestaltGlyphs, attrOpts, data, timeStampIndex);
	}
	get shapeType(): string {
		return this._shapeType;
	}
	/**
 	* Create color domain takes an array of edges and finds the extent of the edge weights.
 	* @param edges 
 	*/
	public createDomain(edges: Array<Edge>) {
		return extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}
}