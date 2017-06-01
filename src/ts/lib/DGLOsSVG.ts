import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20b } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { AttrOpts } from "./DGLOs";
import { DGLOsWill } from "./DGLOsWill";
import { DGLOsMatt } from "./DGLOsMatt";

export class SVGAttrOpts implements AttrOpts {
	private _fill: string;
	private _stroke: string;
	private _stroke_width: number;
	private _radius: number;
	private _opacity: number;
	private _width: number;
	private _height: number;

	constructor(fill?: string, stroke?: string, radius?: number, stroke_width?: number, width?: number, height?: number, opacity?: number) {
		this._fill = fill;
		this._stroke = stroke;
		this._radius = radius;
		this._stroke_width = stroke_width;
		this._width = width;
		this._height = height;
		this._opacity = opacity;
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


	get radius(): number {
		return this._radius;
	}
	set radius(radius: number) {
		this._radius = radius;
	}


	get stroke_width(): number {
		return this._stroke_width;
	}
	set stroke_width(stroke_width: number) {
		this._stroke_width = stroke_width;
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


	get opacity(): number {
		return this._opacity;
	}
	set opacity(opacity: number) {
		this._opacity = opacity;
	}
}

export class DGLOsSVG extends DGLOsWill { }