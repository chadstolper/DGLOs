import { NodeGlyphShape, EdgeGlyphShape } from "./DGLOs";

export class LabelGlyphShape implements NodeGlyphShape {
	readonly _shapeType = "Label";
	private _text = "";
	private _fill = "Black";
	// private _font = "Arial";
	// private _font_weight = "Normal";
	// private _float = "center";

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
export class SourceTargetLineGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "STLine";




	get shapeType(): string {
		return this._shapeType;
	}
}
export class GestaltGlyphShape implements EdgeGlyphShape {
	readonly _shapeType = "Gestalt";




	get shapeType(): string {
		return this._shapeType;
	}
}