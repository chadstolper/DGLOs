import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { AttrOpts } from "../DGLOs";
import * as d3Array from "d3-array";
import { SVGAttrOpts } from "../DGLOsSVG";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import * as d3Scale from "d3-scale";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class RectGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Rect";
	get shapeType(): string {
		return this._shapeType;
	}

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		let rectG = location.append("g").classed("rectEdges", true);
		return rectG;
	}
	public initDraw(glyphs: Selection<any, Edge, any, {}>): Selection<any, Edge, any, {}> {
		let ret: Selection<any, Edge, any, {}> = glyphs.append("rect")
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id; })
		return ret;
	}
	public updateDraw(glyphs: Selection<any, {}, any, {}>, attr: SVGAttrOpts): Selection<any, {}, any, {}> {
		try {
			glyphs
				.attr("fill", attr.fill)
				.attr("width", attr.width)
				.attr("height", attr.height)
				.attr("stroke", attr.stroke)
				.attr("stroke-width", attr.stroke_width);
		} catch (err) {
			console.log("No edges!");
		}
		return glyphs;
	}

	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		console.log(sourceG);
		console.log(targetG);
		sourceG.style("display", "none");
		targetG.style("display", null);
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
	}

	public draw(rectG: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number, attr: SVGAttrOpts): void {
		let rects = rectG.selectAll("rect")
			.data(data.timesteps[TimeStampIndex].edges);
		rects.exit().remove();
		let enter = this.initDraw(rects.enter());
		rects = rects.merge(enter as Selection<any, Edge, any, {}>);
		this.updateDraw(rects, attr);
	}

	public createColorDomain(edges: Array<Edge>) {
		return d3Array.extent(edges, function (d: Edge): number {
			return d.weight;
		});
	}
}