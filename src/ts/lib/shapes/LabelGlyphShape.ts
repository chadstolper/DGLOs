import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

export class LabelGlyphShape implements NodeGlyphShape {
	readonly _shapeType = "Label";
	private _text: string;
	private _fill: string;
	private _x: number;
	private _y: number;
	private _textAnchor: string = "middle";
	private _dominantBaseline: string = "middle";
	// private _font = "ComicSans";

	constructor(text: string, fill: string, x?: number, y?: number) {
		this._text = text;
		this._fill = fill;
		this._x = x;
		this._y = y;
	}

	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return location.append("g").classed("LabelNodes", true);
	}

	/**
	 * Create selection of nodes. Returns new selection
	 * @param glyphs
	 */
	public initDraw(glyphs: Selection<any, Node, any, {}>): Selection<any, Node, any, {}> {
		let ret: Selection<any, Node, any, {}> = glyphs.append("text")
			.classed("label", true)
			.attr("id", function (d: Node): string | number { return d.label; })
			.style("dominant-baseline", "middle")
			.style("text-anchor", "middle");
		return ret;
	}

	/**
	 * Assign and/or update node label data and (x,y) positions
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		try {
			glyphs
				.text(function (d: Node): string {
					return d.label;
				});
			glyphs
				.attr("x", function (d: Node) {
					return d.x;
				})
				.attr("y", function (d: Node) {
					return d.y;
				});
		} catch (err) {
			console.log("No label nodes!");
		}
		return glyphs;
	}

	/**
	* Transform the current NodeGlyphShapes to given NodeGlyphShape
	* @param sourceSelection 
	* @param shape 
	* @param targetSelection 
 	*/
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: NodeGlyphShape, targetG: Selection<any, {}, any, {}>) {
		switch (targetShape.shapeType) {
			case "Circle":
				console.log("Label-->Circle")
				sourceG.style("display", "none");
				targetG.style("display", null);
				break;

			case "Label":
				console.log("Label-->Label Catch");
				sourceG.style("display", null)
				break;

			default: console.log("new NodeShape is undefined");
				break;
		};
	}
	/**
	 * Draw and create new visualizations of nodes, initial update included
	 * @param labelG Should be the labelG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(labelG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number): void {
		let labelGlyphs = labelG.selectAll("text.label")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		labelGlyphs.exit().remove();

		let labelEnter: Selection<any, Node, any, {}> = this.initDraw(labelGlyphs.enter());
		labelGlyphs = labelGlyphs.merge(labelEnter);
		labelGlyphs.call(this.updateDraw);
	}


	get text(): string {
		return this._text;
	}
	set text(text: string) {
		this._text = text;
	}


	get fill(): string {
		return this._fill;
	}
	set fill(fill: string) {
		this._fill = fill;
	}


	get x(): number {
		return this._x;
	}
	set x(x: number) {
		this._x = x;
	}


	get y(): number {
		return this._y;
	}
	set y(y: number) {
		this._y = y;
	}

	get textAnchor(): string {
		return this._textAnchor;
	}

	get dominantBaseline(): string {
		return this._dominantBaseline;
	}


	get shapeType(): string {
		return this._shapeType;
	}
}