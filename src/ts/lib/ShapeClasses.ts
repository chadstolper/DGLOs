import { NodeGlyphShape, EdgeGlyphShape } from "./DGLOs";

export class LabelGlyphShape implements NodeGlyphShape {
}
export class CircleGlyphShape implements NodeGlyphShape { }

export class RectGlyphShape implements EdgeGlyphShape {
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
}
export class SourceTargetLineGlyphShape implements EdgeGlyphShape { }
export class GestaltGlyphShape implements EdgeGlyphShape { }