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

/**
 * Attribute object used for passing collection of options pertaining to GlyphShape visualization.
 * Specific options for fill and stroke-width:
 */
export class SVGAttrOpts implements AttrOpts {
	private _fill: string = null;
	private _stroke: string = null;
	private _stroke_width: number | string = null;
	private _radius: number = null;
	private _opacity = 100;
	private _width: number = null;
	private _height: number = null;

	/**
	 * Fill: "id" - set fill color based on node id; "label" - set fill color based on node label; "type" - set fill color based on node type; "<color>" - set fill of all nodes to <color>.
     * Stroke-Width: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>.
 	 * Opacity defaults to 100%.
	 * @param fill 
	 * @param stroke 
	 * @param radius 
	 * @param stroke_width 
	 * @param width 
	 * @param height 
	 * @param opacity 
	 */
	constructor(fill?: string, stroke?: string, radius?: number, stroke_width?: number | string, width?: number, height?: number, opacity?: number) {
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