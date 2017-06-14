import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { SVGAttrOpts } from "../DGLOsSVG";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { FlubberEdgeShape } from "./FlubberEdgeShape"
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import { interpolate } from "flubber";

/**
 * The __SourceTargetLineGlyphShape__ class contains all of the methods required to draw and position a source-target line
 * (i.e. a straight line) on screen. The only attribute in the class is its __ _shapeType __ which is readonly. Shape types 
 * are used to coordinate transisitons between shapes.
 * 
 * The class implements __EdgeGlyphShape__ and as such must contain the following methods:
 * 	 *init()*, 
 * 	 *initDraw()*,
 * 	 *updateDraw()*, 
 * 	 *transformTo()*,
 *	 *draw()*, 
 */
export class SourceTargetLineGlyphShape extends FlubberEdgeShape implements EdgeGlyphShape {
	readonly _shapeType = "STLine";

	/**
	 * The init method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection and appends a <g> tag with class name STLineEdges.
	 * This class is used to store the line objects.
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("STLineEdges", true);
	}

	/**
	 * The initDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * It takes an SVG selection with entered data and creates line objects with
	 * an ID based on the source and target of the edge.
	 * 
	 * The DynamicGraph and number parameteres are required by the interface but are not
	 * explicitly used here.
	 * @param glyphs 
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public initDraw(edges: Selection<any, Edge, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, Edge, any, {}> {
		let ret: Selection<any, Edge, any, {}> = edges.append("path")
			.classed("STLine", true)
			.attr("id", function (d: Edge): string {
				return d.source.id + ":" + d.target.id;
			})
			.attr("d", "M 500,500 L 501,501 L 502,502 L 503,503 Z");
		return ret;
	}

	/**
	 * The updateDraw method is a requirement of the __EdgeGlyphShape__ interface.
	 * 
	 * updateDraw takes a selection of rectangle glyphs and an SVGAttrOpts object
	 * and assigns attributes to the lines (e.g. lenghth, thickness, etc..). The
	 * method also takes a DynamicGraph and a number as required by the interface.
	 * @param glyphs 
	 * @param attr 
	 * @param data 
	 * @param TimeStampIndex 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		glyphs
			.transition()
			.attrTween("d", function (d: Edge) {
				let elem: HTMLElement = this;
				let oldD: string = elem.getAttribute("d");
				let newD = "M " + d.source.x + "," + d.source.y + " L " + (d.target.x / 2) + "," + (d.target.y / 2) + " L " + d.target.x + "," + d.target.y;
				return interpolate(oldD, newD, { maxSegmentLength: 0.0 });
				//, { maxSegmentLength: 0.0 }
			})


		if (attrOpts.stroke_width === "weight") {
			glyphs.attr("stroke-width", function (d: Edge): number {
				return d.weight;
			});
		}
		else { glyphs.attr("stroke-width", attrOpts.stroke_width) };

		glyphs
			.attr("stroke", attrOpts.stroke)
			.attr("opacity", attrOpts.opacity);
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
	public transformTo(targetShape: EdgeGlyphShape): void {
		switch (targetShape.shapeType) {
			case "Rect":
				console.log("STLine-->Rect");
				break;

			case "STLine":
				console.log("STLine-->STLine Catch");
				break;

			case "Gestalt":
				console.log("STLline-->Gestalt");
				break;

			default:
				console.log(targetShape.shapeType + " is undefined");
		};
		super.transformTo(targetShape);
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
	public draw(sTLineG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts): void {
		let sTLineEdges = sTLineG.selectAll("path.STLine")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });

		sTLineEdges.exit().remove();

		let edgeEnter: Selection<any, Edge, any, {}> = this.initDraw(sTLineEdges.enter(), data, timeStampIndex);

		sTLineEdges = sTLineEdges.merge(edgeEnter);

		this.updateDraw(sTLineEdges, attrOpts, data, timeStampIndex);
	}

	get shapeType(): string {
		return this._shapeType;
	}
}