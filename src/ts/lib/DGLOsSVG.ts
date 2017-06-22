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
 * Attribute object used for passing collection of options pertaining to NodeGlyphShape visualization.
 * Specific options for fill and stroke-width:
 */
export class SVGNodeAttrOpts implements AttrOpts {
	private _fill: string = null;
	private _stroke: string = null;
	private _stroke_width: number | string = null;
	private _stroke_width_label: number | string = null;
	private _radius: number = null;
	private _opacity = 100;

	/**
	 * Fill: "id" - set fill color based on node id; "label" - set fill color based on node label; "type" - set fill color based on node type; "<color>" - set fill of all nodes to <color>.
     * Stroke-Width: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>.
 	 * Opacity defaults to 100%.
	 * @param fill 
	 * @param stroke 
	 * @param radius 
	 * @param stroke_width
	 * @param stroke_width_label
	 * @param opacity 
	 */
	constructor(fill: string, stroke: string, stroke_width: number | string, stroke_width_label?: number | string, radius?: number, opacity?: number) {
		this._fill = fill;
		this._stroke = stroke;
		this._stroke_width = stroke_width;
		this.stroke_width_label = stroke_width_label;
		this._radius = radius;
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


	get stroke_width_label(): number | string {
		return this._stroke_width_label;
	}
	set stroke_width_label(v: number | string) {
		this._stroke_width_label = v;
	}


	get opacity(): number {
		return this._opacity;
	}
	set opacity(opacity: number) {
		this._opacity = opacity;
	}
}
/**
 * Attribute object used for passing collection of options pertaining to EdgeGlyphShape visualization.
 * Specific options for fill and stroke-width:
 */
export class SVGEdgeAttrOpts implements AttrOpts {
	private _fill: string = null;
	private _stroke: string = null;
	private _stroke_width: number | string = null;
	private _width: number = null;
	private _height: number = null;
	private _opacity = 100;

	/**
	 * Fill: "id" - set fill color based on node id; "label" - set fill color based on node label; "type" - set fill color based on node type; "<color>" - set fill of all nodes to <color>.
     * Stroke-Width: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>.
 	 * Opacity defaults to 100%.
	 * @param fill 
	 * @param stroke 
	 * @param stroke_width
	 * @param width
	 * @param height
	 * @param opacity 
	 */
	constructor(fill: string, stroke: string, stroke_width: number | string, width?: number, height?: number, opacity?: number) {
		this._fill = fill;
		this._stroke = stroke;
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

	get stroke_width(): number | string {
		return this._stroke_width;
	}
	/**
     * Stroke-Width: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>. //TODO: do that <--
	 */
	set stroke_width(stroke_width: number | string) {
		this._stroke_width = stroke_width;
	}

	set width(w: number) {
		this._width = w;
	}
	get width(): number {
		return this._width;
	}

	set height(h: number) {
		this._height = h;
	}
	get height(): number {
		return this._height;
	}

	get opacity(): number {
		return this._opacity;
	}
	set opacity(opacity: number) {
		this._opacity = opacity;
	}
}

export class DGLOsSVG extends DGLOsSandwich { }