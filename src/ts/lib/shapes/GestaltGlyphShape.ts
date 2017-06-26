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
			.attr("timestep", function (e: Edge): string {
				return e.timestep + "";
			})
		return ret;
	}

	/**
	 * Assign and/or update edge attributes
	 * @param edges 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, timeStampIndex: number, svgWidth: number, svgHeight: number): Selection<any, {}, any, {}> {
		try {
			let weightScale = scaleLinear<number>()
				.domain(this.createDomain(data.timesteps[timeStampIndex].edges))
				.range([-10, 10]);
			let thicknessScale = scaleLinear<number>()
				.domain(this.createDomain(data.timesteps[timeStampIndex].edges))
				.range([.25, 1.5]);
			let steps = data.timesteps.length;
			let self = this;
			glyphs
				.attr("x1", function (d: Edge) {
					return d.x;
				})
				.attr("y1", function (d: Edge) {
					// let yPos = 0;
					// for (let edge of data.timesteps[timeStampIndex].edges) {
					// 	if (edge.target === d.source && edge.source === d.target && edge.timestep === d.timestep) {
					// 		let yPos = weightScale(d.weight);
					// 		d.y = yPos + d.y;
					// 		break;
					// 	}
					// }
					// return yPos + d.y;
					return 10;
				})
				.attr("x2", function (d: Edge) {
					//return d.x + ((svgWidth / data.timesteps[timeStampIndex].nodes.length) * (7 / 8));
					return 10;
				})
				.attr("y2", function (d: Edge) {
					// let yPos = 0
					// for (let edge of data.timesteps[timeStampIndex].edges) {
					// 	if (edge.source === d.target && edge.target === d.source && edge.timestep === d.timestep) {
					// 		let yPos = weightScale(edge.weight);
					// 		if (yPos === NaN) {
					// 			yPos = 0;
					// 		}
					// 		d.y = yPos + d.y;
					// 		break;
					// 	}
					// }
					// return yPos + d.y;
					return 10;

				})
				.attr("stroke", attrOpts.stroke)
				.attr("stroke-width", function (d: Edge) {
					return thicknessScale(d.weight);
				});



			return glyphs;
		}
		catch (err) {
			// console.log("gestalt update error");
		}
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
		}
		super.transformTo(sourceG, targetShape, targetG);
	}

	/**
	 * Draw and create new visualizations of edges, initial update included
	 * @param gestaltG Should be the gestaltG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(gestaltG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts, svgWidth: number, svgHeight: number): void {
		// console.log("drawingGestalt");
		let gestaltGlyphs = gestaltG.selectAll("line.edgeGestalt")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });

		gestaltGlyphs.exit().remove();

		let gestaltEnter = this.initDraw(gestaltGlyphs.enter(), data, timeStampIndex);

		gestaltGlyphs = gestaltGlyphs.merge(gestaltEnter as Selection<any, Edge, any, {}>);

		this.updateDraw(gestaltGlyphs, attrOpts, data, timeStampIndex, svgWidth, svgHeight);
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