import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../model/dynamicgraph";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

const COLOR_SCHEME: ScaleOrdinal<string | number, string> = scaleOrdinal<string | number, string>(schemeCategory20);


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
		//console.log("init start")
		return location.append("g").classed("LabelNodes", true);
		//console.log("init finished")
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
export class CircleGlyphShape implements NodeGlyphShape {
	readonly _shapeType = "Circle";
	private _radius: number = 10;
	private _fill: string;
	private _stroke: string = "grey";
	private _stroke_width: number = 2;

	constructor(radius: number, fill: string, stroke: string, strokeWidth: number) {
		this._radius = radius;
		this._fill = fill;
		this._stroke = stroke;
		this._stroke_width = strokeWidth;
	}

	/**
	 * Make new <g>
	 * @param location
	 */
	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		//console.log("init start")
		return location.append("g").classed("CircleNodes", true);
		//console.log("init finished")
	}

	/**
	 * Create selection of nodes. Returns new selection
	 * @param glyphs
	 */
	public initDraw(glyphs: Selection<any, Node, any, {}>): Selection<any, Node, any, {}> {
		let ret: Selection<any, Node, any, {}> = glyphs.append("circle")
			.classed("node", true)
			.attr("id", function (d: Node): string | number { return d.id; }) //TODO: Test return id or label?
			.attr("r", 10) //TODO: Remove
			.attr("fill", "purple"); //TODO: remove
		return ret;
	}

	/**
	 * Assign and/or update node circle data and (cx,cy) positions
	 * @param glyphs 
	 */
	public updateDraw(glyphs: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		try {
			glyphs
				.attr("cx", function (d: Node) {
					return d.x;
				})
				.attr("cy", function (d: Node) {
					return d.y;
				});
		} catch (err) {
			console.log("No circle nodes!");
		}
		return glyphs;
	}

	/**
	 * Transform the current NodeGlyphShapes to given NodeGlyphShape
	 * @param sourceSelection 
	 * @param shape 
	 * @param targetSelection 
	 */
	public transformTo(sourceSelection: Selection<any, {}, any, {}>, shape: NodeGlyphShape, targetSelection: Selection<any, {}, any, {}>) {
		switch (shape.shapeType) {
			case "Label":
				console.log("Circle-->Label")
				sourceSelection.transition().style("display", "none");
				targetSelection.transition().style("display", null);
				break;

			case "Circle":
				console.log("Circle-->Circle Catch");
				sourceSelection.style("display", null)
				break;

			default: console.log("new NodeShape is undefined");
				break;
		};
	}

	/**
	 * Draw and create new visualizations of nodes, initial update included
	 * @param circleG Should be the circleG
	 * @param data 
	 * @param timeStepIndex 
	 */
	public draw(circleG: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number): void {
		let circleGlyphs = circleG.selectAll("circle.node")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id });

		circleGlyphs.exit().remove();

		let circleEnter: Selection<any, Node, any, {}> = this.initDraw(circleGlyphs.enter());
		circleGlyphs = circleGlyphs.merge(circleEnter);
		circleGlyphs.call(this.updateDraw);
	}



	get radius(): number {
		return this._radius;
	}

	set radius(radius: number) {
		this._radius = radius;
	}

	get fill(): string {
		return this._fill;
	}

	set fill(fill: string) {
		this._fill = fill;
	}

	get stroke(): string {
		return this._stroke;
	}

	set stroke(stroke: string) {
		this._stroke = stroke;
	}

	get stroke_width(): number {
		return this._stroke_width;
	}

	set stroke_width(stroke_width: number) {
		this._stroke_width = stroke_width;
	}

	get shapeType(): string {
		return this._shapeType;
	}
}

export class RectGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Rect";
	private _width: number;
	private _height: number;
	private _fill: string;
	// private _parent: Selection<any, {}, any, {}>;
	// private _rectGlyphs: Selection<any, {}, any, {}>;

	constructor(width: number, height: number, fill: string, numNodes: number) {
		this._width = width;
		this._height = height;
		this._fill = fill;
	}

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		console.log("init");
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
}


export abstract class LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType: string;
	private _stroke: string;
	private _stroke_width: number;
	private _source: string | number;
	private _target: string | number;
	private _x1: number;
	private _y1: number;
	private _x2: number;
	private _y2: number;
	protected _lineGlyphs: Selection<any, {}, any, {}>;

	constructor(stroke: string, stroke_width: number, source?: string | number, target?: string | number, x1?: number, y1?: number, x2?: number, y2?: number) {
		this._stroke = stroke;
		this._stroke_width = stroke_width;
		this._source = source; //needed?
		this._target = target;
		this._x1 = x1;
		this._y1 = y1;
		this._x2 = x2;
		this._y2 = y2;
	}

	public init(location: Selection<any, {}, any, {}>): void {

	}
	public initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public updateDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		return null;
	}
	public draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number): void {
		return null;
	}

	get stroke(): string {
		return this._stroke;
	}
	set stroke(stroke: string) {
		this._stroke = stroke;
	}


	get stroke_width(): number {
		return this._stroke_width;
	}
	set stroke_width(stroke_width: number) {
		this._stroke_width = stroke_width;
	}


	get source(): string | number {
		return this._source;
	}
	set source(source: string | number) {
		this._source = source;
	}


	get target(): string | number {
		return this._target;
	}
	set target(target: string | number) {
		this._target = target;
	}


	get x1(): number {
		return this._x1;
	}
	set x1(x1: number) {
		this._x1 = x1
	}


	get y1(): number {
		return this._y1;
	}
	set y1(y1: number) {
		this._y1 = y1;
	}


	get x2(): number {
		return this._x2;
	}
	set x2(x2: number) {
		this._x2 = x2
	}


	get y2(): number {
		return this._y2;
	}
	set y2(y2: number) {
		this._y2 = y2;
	}


	get shapeType(): string {
		return this._shapeType;
	}
}

export class SourceTargetLineGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "STLine";

	constructor(stroke: string, stroke_width: number, source?: string | number, target?: string | number, x1?: number, y1?: number, x2?: number, y2?: number) {
		super(stroke, stroke_width, source, target, x1, y1, x2, y2);
	}

	//gets and sets inherited from LineGlyphShape

	get shapeType(): string {
		return this._shapeType;
	}

	public init(location: Selection<any, {}, any, {}>): void {
		location.append("g").classed("STLine", true);
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
		return null;
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

export class GestaltGlyphShape extends LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Gestalt";
	private _angleProperty: number;
	private _timeStepIndex: number;

	constructor(stroke: string, stroke_width: number, angleProperty: number, timeStepIndex: number, source: string | number, target: string | number, x1?: number, y1?: number, x2?: number, y2?: number) {
		super(stroke, stroke_width, source, target, x1, y1, x2, y2);
		this._angleProperty = angleProperty;
		this._timeStepIndex = timeStepIndex;
	}

	public init(location: Selection<any, {}, any, {}>): void {
		location.append("g").classed("GestaltLines", true);
	}
	public initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public updateDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public transformTo(sourceG: Selection<any, {}, any, {}>, targetShape: EdgeGlyphShape, targetG: Selection<any, {}, any, {}>): void {
		return null;
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