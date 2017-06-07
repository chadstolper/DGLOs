import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { LineGlyphShape } from "./LineGlyphShape";
import { SVGAttrOpts } from "../DGLOsSVG";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class GestaltGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Gestalt";

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("GestaltGlyphs", true);
	}

	public initDraw(edges: Selection<any, Edge, any, {}>): Selection<any, {}, any, {}> {
		let ret: Selection<any, Edge, any, {}> = edges.append("line")
			.classed("edgeGestalt", true)
			.attr("id", function (d: Edge): string { return d.source.id + ":" + d.target.id });
		return ret;
	}

	public updateDraw(edges: Selection<any, {}, any, {}>, attrOpts: SVGAttrOpts): Selection<any, {}, any, {}> {
		try {
			// console.log("TODO: attributes for gestalt");
		}
		catch (err) {
			// console.log("attrOpts Gestalt undefined")
		}
		return edges;
	}
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		switch (targetShape.shapeType) {
			case "Rect":
				console.log("Gestalt-->Rect");
				sourceG.transition().style("display", "none");
				targetG.transition().style("display", null);
				break;

			case "STLine":
				console.log("Gestalt-->STLine");
				sourceG.transition().style("display", "none");
				targetG.transition().style("display", null);
				break;

			case "Gestalt":
				console.log("Gestalt-->Gestalt Catch");
				sourceG.style("display", null);
				break;

			default:
				console.log("Transition from", this.shapeType, "to ", targetShape.shapeType, "is unknown.");
		};
	}
	public draw(gestaltG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStampIndex: number, attrOpts: SVGAttrOpts): void {
		let gestaltGlyphs = gestaltG.selectAll("line.edgeGestalt")
			.data(data.timesteps[timeStampIndex].edges, function (d: Edge): string { return "" + d.id });

		gestaltGlyphs.exit().remove();

		let gestaltEnter = this.initDraw(gestaltGlyphs.enter());

		gestaltGlyphs = gestaltGlyphs.merge(gestaltEnter as Selection<any, Edge, any, {}>);

		this.updateDraw(gestaltGlyphs, attrOpts);
	}
	get shapeType(): string {
		return this._shapeType;
	}
}