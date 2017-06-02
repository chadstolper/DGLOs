import { NodeGlyphShape, EdgeGlyphShape } from "./DGLOs";

export class LabelGlyphShape implements NodeGlyphShape {
	readonly _shapeType = "Label";
	private _text: string;
	private _fill: string;
	private _X: number;
	private _Y: number;
	// private _font = "ComicSans";
	// private _font_weight = "Normal";
	//private _font_size : string |number; //eg. "10px"
	// private _float = "center";

	constructor(text: string, fill: string, x?: number, y?: number) {
		this._text = text;
		this._fill = fill;
		this._X = x;
		this._Y = y;
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


	get X(): number {
		return this._X;
	}
	set X(x: number) {
		this._X = x;
	}


	get Y(): number {
		return this._Y;
	}
	set Y(y: number) {
		this._Y = y;
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
}

export abstract class LineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType: string;
	private _stroke: string;
	private _stroke_width: number;
	private _source: string | number;
	private _target: string | number;
	private _X1: number;
	private _Y1: number;
	private _X2: number;
	private _Y2: number;

	constructor(stroke: string, stroke_width: number, source?: string | number, target?: string | number, x1?: number, y1?: number, x2?: number, y2?: number) {
		this._stroke = stroke;
		this._stroke_width = stroke_width;
		this._source = source; //needed?
		this._target = target;
		this._X1 = x1;
		this._Y1 = y1;
		this._X2 = x2;
		this._Y2 = y2;
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


	get X1(): number {
		return this._X1;
	}
	set X1(x1: number) {
		this._X1 = x1
	}


	get Y1(): number {
		return this._Y1;
	}
	set Y1(y1: number) {
		this._Y1 = y1;
	}


	get X2(): number {
		return this._X2;
	}
	set X2(x2: number) {
		this._X2 = x2
	}


	get Y2(): number {
		return this._Y2;
	}
	set Y2(y2: number) {
		this._Y2 = y2;
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