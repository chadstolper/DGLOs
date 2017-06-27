import { AttrOpts } from "./DGLOs";
import { DGLOsSandwich } from "./DGLOsSandwich";

/**
 * Attribute object used for passing collection of options pertaining to GlyphShape visualization.
 * Specific options for fill and stroke-width:
 */
export class SVGAttrOpts implements AttrOpts { //TODO: do we need attrOpts?
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
	//TODO: switch strokewidthlabel with strokeedge
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
	set fill(str: string) {
		this._fill = str;
	}


	get stroke(): string {
		return this._stroke;
	}
	set stroke(str: string) {
		this._stroke = str;
	}


	get radius(): number {
		return this._radius;
	}
	set radius(r: number) {
		this._radius = r;
	}


	get stroke_width(): number | string {
		return this._stroke_width;
	}
	/**
     * Stroke-Width: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>.
	 */
	set stroke_width(vStr: number | string) {
		this._stroke_width = vStr;
	}

	get stroke_width_label(): number {
		return this._stroke_width_label;
	}
	set stroke_width_label(v: number) {
		this._stroke_width_label = v;
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


export class SimulationAttrOpts implements AttrOpts {
	private _simulationCollision: boolean;
	private _simulationWeight: boolean;
	private _divisorPT: number;
	private _divisorPX: number;
	private _simulationAlpha: number;
	private _simulationCharge: number;
	private _simulationLinkStrength: number;

	/**
	 * Object holding simulation related information. Changing attributes will change the simulation characteristics as specified.
	 * Leaving the contsructor empty will return default values for all attributes.
	 * @param simulationCollision : Default = false; NodeGlyphShapes can clip/overlap.
	 * @param simulationWeight : Default = false; Links will default to D3 link.strength values. Links will not pull based on Edge data.
	 * @param divisorPT : Default = 2.75; Relative collision radius resizing value for LabelGlyphs with text sized by pt. Higher values = closer collision radius.
	 * @param divisorPX : Default = 3.25; Relative collision radius resizing value for LabelGlyphs with text sized by px. Higher values = closer collision radius.
	 * @param alpha : Default = 0.3; Starting "energy" for simulation elements.
	 * @param charge : Default = -100; Push applied to simulation elements from the center.
	 * @param linkStrength : Default = 0.05; strength of Edge pulling between 2 Nodes in the simualtion.
	 */
	constructor(simulationCollision: boolean = false, simulationWeight: boolean = false, divisorPT: number = 2.75, divisorPX: number = 3.25, alpha: number = .3, charge: number = -100, linkStrength: number = .05) {
		this._simulationCollision = simulationCollision;
		this._simulationWeight = simulationWeight;
		this._divisorPT = divisorPT;
		this._divisorPX = divisorPX;
		this._simulationAlpha = alpha;
		this._simulationCharge = charge;
		this._simulationLinkStrength = linkStrength;
	}

	set simulationCollisionEnabled(boo: boolean) {
		this._simulationCollision = boo;
	}
	get simulationCollisionEnabled(): boolean {
		return this._simulationCollision;
	}
	set simulationWeightEnabled(boo: boolean) {
		this._simulationWeight = boo;
	}
	get simulationWeightEnabled(): boolean {
		return this._simulationWeight;
	}
	set divisorPT(v: number) {
		this._divisorPT = v;
	}
	get divisorPT(): number {
		return this._divisorPT;
	}
	set divisorPX(v: number) {
		this._divisorPX = v;
	}
	get divisorPX(): number {
		return this._divisorPX;
	}
	set alpha(v: number) {
		this._simulationAlpha = v;
	}
	get alpha(): number {
		return this._simulationAlpha;
	}
	set charge(v: number) {
		this._simulationCharge = v;
	}
	get charge(): number {
		return this._simulationCharge;
	}
	set linkStrength(v: number) {
		this._simulationLinkStrength = v;
	}
	get linkStrength(): number {
		return this._simulationLinkStrength;
	}

}

export class DGLOsSVG extends DGLOsSandwich { } //TODO: why do we need to extend the sandwich?