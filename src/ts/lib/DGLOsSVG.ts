import { DGLOsSandwich } from "./DGLOsSandwich";

/**
 * Attribute object used for passing collection of options pertaining to GlyphShape visualization.
 * Unique options for fill and stroke-width-edge.
 */
export class SVGAttrOpts {
	private _fill: string;
	private _stroke: string;
	private _stroke_edge: string;
	private _stroke_width: number;
	private _stroke_width_edge: number | string;
	private _radius: number;
	private _width: number;
	private _height: number;
	private _opacity: number;
	private _font_size: string;

	/**
	 * Order: Node, Node, Edge, Node, Edge, Node, Edge, Edge, Both, Node/neither.
	 * @param fill "id" - set fill color based on node id; "label" - set fill color based on node label; "type" - set fill color based on node type; "<color>" - set fill of all nodes to <color>.
	 * @param stroke
	 * @param stroke_edge
	 * @param stroke_width Defaults to 2.
	 * @param stroke_width_edge Defaults to 1. "weight" - assign line thickness based on edge weight/10; <number> - set all edges' thickness to <number>.
	 * @param radius Defaults to 10.
	 * @param width 
	 * @param height 
	 * @param opacity Defaults to 100.
	 * @param font_size Defaults to "12px". eg. "12px", "25pt", "10px", "14pt", etc.
	 */
	constructor(fill: string, stroke: string, stroke_edge: string, stroke_width: number = 2, stroke_width_edge: number | string = 1, radius: number = 10, width?: number, height?: number, opacity: number = 100, font_size: string = "12px") {
		this._fill = fill;
		this._stroke = stroke;
		this._stroke_edge = stroke_edge;
		this._stroke_width = stroke_width;
		this._stroke_width_edge = stroke_width_edge;
		this._radius = radius;
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


	get stroke_edge(): string {
		return this._stroke_edge;
	}
	set stroke_edge(str: string) {
		this._stroke_edge = str;
	}


	get radius(): number {
		return this._radius;
	}
	set radius(r: number) {
		this._radius = r;
	}


	get stroke_width(): number {
		return this._stroke_width;
	}
	set stroke_width(num: number) {
		this._stroke_width = num;
	}

	/**
     * Stroke-Width-Edge: "weight" - assign line thickness based on edge weight/10; <number> - set all edge thickness to <number>.
	 */
	get stroke_width_edge(): number | string {
		return this._stroke_width_edge;
	}
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
	set opacity(num: number) {
		this._opacity = num;
	}

	/**
	 * eg. "12px", "14pt", "42px", "69pt"
	 */
	set font_size(str: string) {
		this._font_size = str;
	}
	get font_size(): string {
		return this._font_size;
	}
}


/**
 * Attribute object used for passing collection of options pertaining to simulation mechanics.
 */
export class SimulationAttrOpts {
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
	 * @param simulationCollision Default = false; NodeGlyphShapes can clip/overlap.
	 * @param simulationWeight Default = false; Links will default to D3 link.strength values. Links will not pull based on Edge data.
	 * @param divisorPT Default = 2.75; Relative collision radius resizing value for LabelGlyphs with text sized by pt. Higher values = closer collision radius.
	 * @param divisorPX Default = 3.25; Relative collision radius resizing value for LabelGlyphs with text sized by px. Higher values = closer collision radius.
	 * @param alpha Default = 0.3; Starting "energy" for simulation elements.
	 * @param charge Default = -100; Push applied to simulation elements from the center.
	 * @param linkStrength Default = 0.05; strength of Edge pulling between 2 Nodes in the simualtion.
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
	set divisorPT(num: number) {
		this._divisorPT = num;
	}
	get divisorPT(): number {
		return this._divisorPT;
	}
	set divisorPX(num: number) {
		this._divisorPX = num;
	}
	get divisorPX(): number {
		return this._divisorPX;
	}
	set alpha(num: number) {
		this._simulationAlpha = num;
	}
	get alpha(): number {
		return this._simulationAlpha;
	}
	set charge(num: number) {
		this._simulationCharge = num;
	}
	get charge(): number {
		return this._simulationCharge;
	}
	set linkStrength(num: number) {
		this._simulationLinkStrength = num;
	}
	get linkStrength(): number {
		return this._simulationLinkStrength;
	}

}

// export class DGLOsSVG extends DGLOsSandwich { } //TODO: why do we need to extend the sandwich?