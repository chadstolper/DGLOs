import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { LineGlyphShape } from "./LineGlyphShape";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class SourceTargetLineGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "STLine";

	constructor(stroke: string, stroke_width: number, source?: string | number, target?: string | number, x1?: number, y1?: number, x2?: number, y2?: number) {
		super(stroke, stroke_width, source, target, x1, y1, x2, y2);
	}

	//gets and sets inherited from LineGlyphShape

	get shapeType(): string {
		return this._shapeType;
	}

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		let STLineG = location.append("g")
			.classed("rectEdges", true);
		return STLineG;
	}
	public initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		console.log(selection);
		selection.enter().append("line")
			.attr("id", function (d: Edge): string {
				return d.source.id + ":" + d.target.id;
			})
		return selection;
	}
	public updateDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
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
	public draw(selection: Selection<any, {}, any, {}>, data: DynamicGraph, TimeStampIndex: number): void {
		this.init(selection);
		//works
		this._lineGlyphs = selection/*.select("STLine")*/.selectAll("line")
			.data(data.timesteps[TimeStampIndex].edges);
		this._lineGlyphs = this.initDraw(this._lineGlyphs);

		// let _rectEnter = this.updateDraw(this._rectGlyphs.data(data.timesteps[TimeStampIndex].edges).enter());
	}
}