import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class RectGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Rect";
	private _width: number;
	private _height: number;
	private _fill: string;

	constructor(width: number, height: number, fill: string, numNodes: number) {
		this._width = width;
		this._height = height;
		this._fill = fill;
	}

	get width(): number {
		return this._width;
	}
	set width(width: number) {
		this._width = width;
	}
	get height(): number {
		return this._height;
	}
	set height(height: number) {
		this._height = height;
	}
	get fill(): string {
		return this._fill;
	}
	set fill(fill: string) {
		this._fill = fill;
	}

	get shapeType(): string {
		return this._shapeType;
	}

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		let rectG = location.append("g")
			.classed("rectEdges", true);
		return rectG;
	}

	public initDraw(selection: Selection<any, Edge, any, {}>): Selection<any, Edge, any, {}> {
		console.log("initDraw");
		selection.enter().append("rect")
			.attr("id", function (d: Edge) {
				return d.source.id + ":" + d.target.id;
			})
		return selection;
	}
	public updateDraw(glyphs: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		console.log("updateDraw");
		glyphs
			.attr("x", function (d: Edge) {
				console.log(d);
				return (+d.source.id / 12) * 100 + "%";
			})
			.attr("y", function (d: Edge) {
				return (+d.target.id / 12) * 100 + "%";
			})
			.attr("fill", this._fill)
			.attr("width", 10)
			.attr("height", 10);
		console.log("leaving updateDraw");
		return glyphs;
	}

	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
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

	public draw(rectG: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number): void {

		let rects = rectG.selectAll("rect")
			.data(data.timesteps[TimeStampIndex].edges, function (d: Edge): string { return d.source + ":" + d.target });
		let enter = this.initDraw(rects.enter());
		rects.exit().remove();
		rects = rects.merge(enter);
		this.updateDraw(rects);

	}
}