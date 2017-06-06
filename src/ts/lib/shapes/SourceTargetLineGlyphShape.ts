import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { SVGAttrOpts } from "../DGLOsSVG";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { LineGlyphShape } from "./LineGlyphShape";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class SourceTargetLineGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "STLine";

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("STDLineEdges", true);
	}

	public initDraw(edges: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		console.log(edges)
		let ret: Selection<any, {}, any, {}> = edges.append("line")
			.classed("STLine", true)
			.attr("id", function (d: Edge): string {
				return d.source.id + ":" + d.target.id;
			})
		return ret;
	}

	public updateDraw(edges: Selection<any, {}, any, {}>, attr: SVGAttrOpts): Selection<any, {}, any, {}> {
		try {
			edges
				.attr("x1", function (d: Edge) { return d.source.x; })
				.attr("y1", function (d: Edge) { return d.source.y; })
				.attr("x2", function (d: Edge) { return d.target.x; })
				.attr("y2", function (d: Edge) { return d.target.y; });
		} catch (err) {
			console.log("No STDLines links!");
		}

		if (attr.stroke_width === "weight") {
			edges.attr("stroke-width", function (d: Edge): number {
				return d.weight;
			});
		}
		else edges.attr("stroke-width", attr.stroke_width);

		edges
			.attr("stroke", attr.stroke)
			.attr("opacity", attr.opacity);

		return edges;
	}

	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		sourceG.style("display", "none");
		targetG.style("display", null);

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
	public draw(sTLineG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attr: SVGAttrOpts): void {
		let sTLineEdges = sTLineG.selectAll("STDLine.edge")
			.data(data.timesteps[timeStampIndex].nodes, function (d: Edge): string { return "" + d.id });

		sTLineEdges.exit().remove();

		let edgeEnter: Selection<any, Edge, any, {}> = this.initDraw(sTLineEdges.enter());
		sTLineEdges = sTLineEdges.merge(edgeEnter);
		sTLineEdges.call(this.updateDraw);
	}

	get shapeType(): string {
		return this._shapeType;
	}
}