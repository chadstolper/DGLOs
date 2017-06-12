import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { AttrOpts } from "../DGLOs";
import { extent } from "d3-array";
import { SVGAttrOpts } from "../DGLOsSVG";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import * as d3Scale from "d3-scale";
import { Shape } from "./Shape"

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

/**
 * The __RectGlyphsShape__ class contains all of the methods required to draw and position a rectangle on screen.
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
export class RectGlyphShape extends Shape implements EdgeGlyphShape {
	readonly _shapeType = "Rect";
	get shapeType(): string {
		return this._shapeType;
	}

	/**
	 * The init method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection and appends a <g> tag with class name rectEdges.
	 * This class is used to store the rectangle objects.
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		let rectG = location.append("g").classed("rectEdges", true);
		return rectG;
	}
	/**
	 * The initDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection with entered data and creates rectangle objects with
	 * an ID based on the source and target of the edge.
	 * 
	 * The DynamicGraph and number parameteres are required by the interface but are not
	 * explicitly used here.
	 * @param glyphs 
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public initDraw(glyphs: Selection<any, Edge, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, Edge, any, {}> {
		let ret: Selection<any, Edge, any, {}> = glyphs.append("rect")
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id; })
		return ret;
	}
	/**
	 * The updateDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * updateDraw takes a selection of rectangle glyphs and an SVGAttrOpts object
	 * and assigns attributes to the rectangles (e.g. Width, Height, etc..). The
	 * method also takes a DynamicGraph and a number. These are used to make 
	 * calculations required to color the rectanges on a linear color scale.
	 * @param glyphs 
	 * @param attr 
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attr: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		try {
			let colorMap = d3Scale.scaleLinear<string>()
				.domain(this.createColorDomain(data.timesteps[TimeStampIndex].edges))
				.range(["Aquamarine", "LemonChiffon"]);
			glyphs
				.attr("x", function (e: Edge) {
					return e.x;
				})
				.attr("y", function (e: Edge) {
					return e.y;
				})
				.attr("fill", function (d: Edge) {
					return colorMap(d.weight);
				})
				.attr("width", attr.width)
				.attr("height", attr.height)
				.attr("stroke", attr.stroke)
				.attr("stroke-width", attr.stroke_width);
		} catch (err) {
			console.log("No edges!");
		}
		return glyphs;
	}
	/**
	 * The transformTo is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * transformTo takes the current <g> tag displaying glyphs, an EdgeGlyphsShape, and a target <g> tag.
	 * It hides all glyphs in the current tag, and unhides all glyphs in the target tag.
	 * @param sourceG 
	 * @param targetShape 
	 * @param targetG 
	 */
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		switch (targetShape.shapeType) {
			case "Rect":
				break;
			case "STLine":
				break;
			case "Gestalt":
				break;
			default:
				console.log("Transition from", this.shapeType, "to ", targetShape.shapeType, "is unknown.");
		}
		console.log("rectTransformTo: " + targetShape.shapeType);
		super.transformTo(sourceG, targetShape, targetG);
	}
	/**
	 * The draw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * The draw method takes a SVG selection to draw within, a DynamicGraph to be displayed, a timeStampIndex,
	 * and an SVGAttrOpts object to assign attributes to draw.
	 * @param rectG 
	 * @param data 
	 * @param timeStampIndex 
	 * @param attr 
	 */
	public draw(rectG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attr: SVGAttrOpts): void {
		let rects = rectG.selectAll("rect")
			.data(data.timesteps[timeStampIndex].edges);
		rects.exit().remove();
		let enter = this.initDraw(rects.enter(), data, timeStampIndex);
		rects = rects.merge(enter as Selection<any, Edge, any, {}>);
		this.updateDraw(rects, attr, data, timeStampIndex);
	}

	/**
	 * Create color domain takes an array of edges and finds the extent of the edge weights.
	 * @param edges 
	 */
	public createColorDomain(edges: Array<Edge>) {
		return extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}
}