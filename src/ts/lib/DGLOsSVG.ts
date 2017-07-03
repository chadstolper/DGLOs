import { DGLOsSandwich } from "./DGLOsSandwich";

/**
 * Attribute object used for passing collection of options pertaining to GlyphShape visualization.
 * Unique options for fill and stroke-width-edge.
 */
export class SVGAttrOpts {
	private _fill: string = "#FFFFFF";
	private _stroke: string = "#000000"
	private _stroke_edge: string = "#000000";
	private _stroke_width: number = 2;
	private _stroke_width_edge: number | string = 1;
	private _radius: number = 10;
	private _width: number;
	private _height: number;
	private _opacity: number = 100;
	private _font_size: string = "12px";
	private _font: string = "Sans Serif";

	constructor(fill: string = "#FFFFFF", stroke: string = "#000000", stroke_edge: string = "#000000", stroke_width: number = 2, stroke_width_edge: number | string = 1, radius: number = 10, width?: number, height?: number, opacity: number = 100, font_size: string = "12px", font: string = "Sans Serif") {
		this._fill = fill;
		this._stroke = stroke;
		this._stroke_edge = stroke_edge;
		this._stroke_width = stroke_width;
		this._stroke_width_edge = stroke_width_edge;
		this._radius = radius;
		this._opacity = opacity;
		this._font_size = font_size;
		this._font = font;
	}

	get fill(): string {
		return this._fill;
	}
	/**
	 * Fill: "id" - set fill color based on node id; "label" - set fill color based on node label; 
	 * "type" - set fill color based on node type; "<color>" - set fill of all nodes to <color>. Defaults to "#FFFFFF".
	 */
	set fill(str: string) {
		this._fill = str;
	}
	get stroke(): string {
		return this._stroke;
	}
	/**
	 * Defaults to "#000000".
	 */
	set stroke(str: string) {
		this._stroke = str;
	}
	get stroke_edge(): string {
		return this._stroke_edge;
	}
	/**
	 * Defaults to "#000000".
	 */
	set stroke_edge(str: string) {
		this._stroke_edge = str;
	}
	get radius(): number {
		return this._radius;
	}
	/**
	 * Defaults to 10.
	 */
	set radius(r: number) {
		this._radius = r;
	}
	get stroke_width(): number {
		return this._stroke_width;
	}
	/**
	 * Defaults to 2.
	 */
	set stroke_width(num: number) {
		this._stroke_width = num;
	}
	get stroke_width_edge(): number | string {
		return this._stroke_width_edge;
	}
	/**
     * Stroke-Width-Edge: "weight" - assign line thickness based on edge weight; <number> - set all edge thickness to <number>.
	 */
	set stroke_width_edge(v: number | string) {
		this._stroke_width_edge = v;
	}
	get width(): number {
		return this._width;
	}
	set width(w: number) {
		this._width = w;
	}
	get height(): number {
		return this._height;
	}
	set height(h: number) {
		this._height = h;
	}
	get opacity(): number {
		return this._opacity;
	}
	/**
	 * Default = 100.
	 */
	set opacity(num: number) {
		this._opacity = num;
	}
	/**
	 * Default = "12px".
	 * eg. "12px", "14pt", "42px", "37pt"
	 */
	set font_size(str: string) {
		this._font_size = str;
	}
	get font_size(): string {
		return this._font_size;
	}
	/**
	 * Default = "Comic Sans".
	 */
	set font(str: string) {
		this._font = str;
	}
	get font(): string {
		return this._font;
	}
}

export class DGLOsSVG extends DGLOsSandwich { };