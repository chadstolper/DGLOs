import { NodeGlyphShape } from "../NodeGlyphInterface"
import { EdgeGlyphShape } from "../EdgeGlyphInterface";
import { Selection } from "d3-selection";
import { DynamicGraph, Node, Edge } from "../../model/dynamicgraph";

import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";

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

	public init(location: Selection<any, {}, any, {}>): Selection<any, {}, any, {}> {
		return null;
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
