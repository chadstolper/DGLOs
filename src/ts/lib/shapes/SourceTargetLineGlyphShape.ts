import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { SVGAttrOpts } from "../DGLOsSVG";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { LineGlyphShape } from "./LineGlyphShape";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class SourceTargetLineGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "STLine";

	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("STLineEdges", true);
	}

	/**
	 * Create selection of edges. Returns new selection
	 * @param edges
	 */
	public initDraw(edges: Selection<any, Edge, any, {}>, data: DynamicGraph, TimeStampIndex: number): Selection<any, Edge, any, {}> {
		let ret: Selection<any, Edge, any, {}> = edges.append("line")
			.classed("STLine", true)
			.attr("id", function (d: Edge): string {
				return d.source.id + ":" + d.target.id;
			})
		return ret;
	}

	/**
	 * Assign and/or update edge line attributes and ((x1, y1), (x2, y2)) positions
	 * @param edges 
	 */
	public updateDraw(edges: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts, data: DynamicGraph, TimeStampIndex: number): Selection<any, {}, any, {}> {
		try {
			edges
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} catch (err) {
			console.log("No STDLines links!");
		}

		try {
			if (attrOpts.stroke_width === "weight") {
				edges.attr("stroke-width", function (d: Edge): number {
					return d.weight / 10;
				});
			}
			else { edges.attr("stroke-width", attrOpts.stroke_width) };

			edges
				.attr("stroke", attrOpts.stroke)
				.attr("opacity", 0.05);
		}
		catch (err) {
			console.log("attrOpts undefined");
		}

		return edges;
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
				console.log("STLine-->Rect");
				sourceG.transition().style("display", "none");
				targetG.transition().style("display", null);
				break;

			case "STLine":
				console.log("STLine-->STLine Catch");
				sourceG.style("display", null);
				break;

			case "Gestalt":
				console.log("STLline-->Gestalt");
				sourceG.transition().style("display", "none");
				targetG.transition().style("display", null);
				break;

			default:
				console.log(targetShape.shapeType + " is undefined");
		};
	}

	/**
	 * Draw and create new visualizations of edges, initial update included
	 * @param sTlineG Should be the sTlineG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(sTLineG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts): void {
		let sTLineEdges = sTLineG.selectAll("STDLine.edge")
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