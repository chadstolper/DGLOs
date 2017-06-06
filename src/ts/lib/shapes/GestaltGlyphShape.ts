import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";
import { AttrOpts } from "../DGLOs";
import { LineGlyphShape } from "./LineGlyphShape";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class GestaltGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Gestalt";
	private _angleProperty: number;
	private _timeStepIndex: number;

	constructor(stroke: string, stroke_width: number, angleProperty: number, timeStepIndex: number, source: string | number, target: string | number, x1?: number, y1?: number, x2?: number, y2?: number) {
		super(stroke, stroke_width, source, target, x1, y1, x2, y2);
		this._angleProperty = angleProperty;
		this._timeStepIndex = timeStepIndex;
	}

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		let gestaltG = location.append("g")
			.classed("rectEdges", true);
		return gestaltG;
	}
	public initDraw(selection: Selection<any, {}, any, {}>, attr: AttrOpts): Selection<any, {}, any, {}> {
		return null;
	}
	public updateDraw(selection: Selection<any, {}, any, {}>, attr: AttrOpts): Selection<any, {}, any, {}> {
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
	public draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number): void {
		return null;
	}


	get angleProperty(): number {
		return this._angleProperty;
	}
	set angleProperty(angleProperty: number) {
		this._angleProperty = angleProperty;
	}


	get timeStepIndex(): number {
		return this.timeStepIndex;
	}
	set timeStepIndex(timeStepIndex: number) {
		this._timeStepIndex = timeStepIndex;
	}


	get shapeType(): string {
		return this._shapeType;
	}
}