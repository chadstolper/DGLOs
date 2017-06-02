import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../model/dynamicgraph";

export class LabelGlyphShape implements NodeGlyphShape {
	readonly _shapeType = "Label";
	private _text: string;
	private _fill: string;
	private _x: number;
	private _y: number;
	private _textAnchor: string = "middle";
	private _dominantBaseline: string = "middle";
	// private _font = "ComicSans";

	private _labelGlyphs: Selection<any, {}, any, {}>;

	constructor(text: string, fill: string, x?: number, y?: number) {
		this._text = text;
		this._fill = fill;
		this._x = x;
		this._y = y;
	}

	public init(location: Selection<any, {}, any, {}>): void {
		this._labelGlyphs = location.append("g").classed("Nodes", true);
	}
	//TODO: Make new <g>
	public initDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		let newLabel = location.append("text")
			.attr("id", function (d: Node): string | number { return d.label; })
			.style("dominant-baseline", "middle")
			.style("text-anchor", "middle");
		return newLabel;
	}
	//TODO: draw nodes
	public updateDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		if (this._labelGlyphs !== undefined) {
			this._labelGlyphs
				.attr("x", function (d: Node) {
					return d.x;
				})
				.attr("y", function (d: Node) { return d.y; });
		} else {
			console.log("No label nodes!");

		}
		return this._labelGlyphs; //?
	}
	//TODO: position and add attr to nodes
	public transformTo(shape: NodeGlyphShape): NodeGlyphShape {
		console.log("eventually");
		return;
	}
	//TODO: says what it does on the tin
	public draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number): void {
		this._labelGlyphs = location.selectAll("label")
			.data(data.timesteps[timeStepIndex].nodes, function (d: Node): string { return "" + d.id })
			.enter().call(this.initDraw);

		this._labelGlyphs.exit().remove();

		let labelEnter = this._labelGlyphs.enter().call(this.init);

		this._labelGlyphs = this._labelGlyphs.merge(labelEnter);
		this._labelGlyphs
			.text(function (d: Node): string {
				return d.label;
			});
	}
	//TODO: .data(data.timestep[timestepindex]).enter().call(initDraw(location))


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
	private _radius: number;
	private _fill: string;
	private _stroke: string;
	private _stroke_width: number;

	constructor(radius: number, fill: string, stroke: string, strokeWidth: number) {
		this._radius = radius;
		this._fill = fill;
		this._stroke = stroke;
		this._stroke_width = strokeWidth;

	}


	init(location: Selection<any, {}, any, {}>) {

	}
	//TODO: Make new <g>
	initDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return;
	}
	//TODO: draw nodes
	updateDraw(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return;
	}
	//TODO: position and add attr
	transformTo(shape: NodeGlyphShape): NodeGlyphShape {
		return;
	}
	//TODO: says what it does on the tin
	draw(location: Selection<any, {}, any, {}>, data: DynamicGraph, timeStepIndex: number) {

	}
	//TODO: .data(data.timestep[timestepindex]).enter().call(initDraw(location))

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

	constructor(width: number, height: number, fill: string) {
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
	public init(location: Location): void {

	}
	public initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public updateDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public transformTo(shape: EdgeGlyphShape): EdgeGlyphShape {
		return null;
	}
	public draw(selection: Selection<any, {}, any, {}>, dGraph: DynamicGraph, TimeStampIndex: number): void {
		return null;
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

	public init(location: Location): void {

	}
	public initDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public updateDraw(selection: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
	}
	public transformTo(shape: EdgeGlyphShape): EdgeGlyphShape {
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