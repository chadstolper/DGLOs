import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { DGLOsSVGCombined } from "./DGLOsSVGCombined";
import { AttrOpts } from "./DGLOs";
import { DGLOsWill } from "./DGLOsWill";
import { DGLOsMatt } from "./DGLOsMatt";
import { DGLOsSandwich } from "./DGLOsSandwich";

/**
 * Attribute object used for passing collection of options pertaining to GlyphShape visualization.
 * Specific options for fill and stroke-width:
 */
export class SVGAttrOpts implements AttrOpts {
	private _fill: string = null;
	private _stroke: string = null;
	private _stroke_width: number | string;
	private _stroke_width_label: number;
	private _radius: number = null;
	private _width: number = null;
	private _height: number = null;
	private _opacity: number;
	private _font_size: string;

	/**
	 * Fill: "id" - set fill color based on node id; "label" - set fill color based on node label; "type" - set fill color based on node type; "<color>" - set fill of all nodes to <color>.
     * Stroke-Width: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>.
 	 * Opacity defaults to 100%.
	 * @param fill 
	 * @param stroke
	 * @param stroke_width
	 * @param stroke_width_label
	 * @param radius
	 * @param width 
	 * @param height 
	 * @param opacity 
	 * @param font_size eg. "12px", "25pt", "10px", "14pt", etc.
	 */
	// constructor(fill: string, stroke: string, stroke_width: number | string, stroke_width_label?: number, radius?: number, width?: number, height?: number, opacity?: number, font_size?: string) {
	constructor(fill: string, stroke: string, stroke_width: number | string = 0, stroke_width_label: number = 0, radius?: number, width?: number, height?: number, opacity: number = 100, font_size: string = "12px") {
		this._fill = fill;
		this._stroke = stroke;
		this._radius = radius;
		this._stroke_width = stroke_width;
		this._stroke_width_label = stroke_width_label;
		this._width = width;
		this._height = height;
		this._opacity = opacity;
		this._font_size = font_size;
	}

	get fill(): string {
		return this._fill;
	}
	/**
	 * Fill: "id" - set fill color based on node id; "label" - set fill color based on node label; "type" - set fill color based on node type; "<color>" - set fill of all nodes to <color>.
	 */
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


	get stroke_width(): number | string {
		return this._stroke_width;
	}
	/**
     * Stroke-Width: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>.
	 */
	set stroke_width(stroke_width: number | string) {
		this._stroke_width = stroke_width;
	}

	get stroke_width_label(): number {
		return this._stroke_width_label;
	}
	set stroke_width_label(stroke_width_label: number) {
		this._stroke_width_label = stroke_width_label;
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


	set font_size(v: string) {
		this._font_size = v;
	}
	get font_size(): string {
		return this._font_size;
	}
}

export class DGLOsSVG extends DGLOsSandwich { }