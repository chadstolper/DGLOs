import { DGLOs, AttrOpts } from "./DGLOs";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import * as model from "../model/DynamicGraph";

import { RectGlyphShape } from "./shapes/RectGlyphShape";
import { CircleGlyphShape } from "./shapes/CircleGlyphShape";
import { LabelGlyphShape } from "./shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "./shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "./shapes/GestaltGlyphShape";
import { VoronoiGroupGlyph } from "./shapes/VoronoiGroupGlyph";

import { DynamicGraph } from "../model/DynamicGraph";
import { Selection } from "d3-selection";

/**
 * Our extension of DGLOs to impelement SVG as the method of drawing.
 */
export class DGLOsSVGBaseClass implements DGLOs {
	protected _data: model.DynamicGraph;
	protected _location: Selection<any, {}, any, {}>;
	protected _drawLocation: Selection<any, {}, any, {}>;
	protected _height: number;
	protected _width: number;
	protected _dataToDraw: model.DynamicGraph;

	public get data(): model.DynamicGraph {
		return this._data;
	}
	public set data(dGraph: model.DynamicGraph) {
		this._data = dGraph;
	}
	public get width(): number {
		return this._width;
	}
	public get height(): number {
		return this._height;
	}
	public get drawLoc(): Selection<any, {}, any, {}> {
		return this._drawLocation;
	}
	public get loc(): Selection<any, {}, any, {}> {
		return this._location;
	}
	public set dataToDraw(dGraph: model.DynamicGraph) {
		this._dataToDraw = dGraph;
	}
	public get dataToDraw(): model.DynamicGraph {
		return this._dataToDraw;
	}


	constructor(data: DynamicGraph, location: Selection<any, {}, any, {}>, width: number = 500, height: number = 500) {
		this._data = data;
		this._location = location;
		this._dataToDraw = data;
		this._width = width;
		this._height = height;
		this._drawLocation = location.append("svg")
			.classed("SVG_1", true)
			.attr("width", this.width)
			.attr("height", this.height);
		// if (location.attr("width")) { this._width = +location.attr("width"); }
		// if (location.attr("height")) { this._height = +location.attr("height") }
	}
	private _centralNodeID: number | string;
	/**
	 * A boolean that decides if, on clicking a node, the graph should be redrawn.
	 * Used for Egographs.
	 */
	private _onClickRedraw: boolean;

	public get onClickRedraw(): boolean {
		return this._onClickRedraw;
	}
	public set onClickRedraw(onClickRedraw: boolean) {
		this._onClickRedraw = onClickRedraw;
	}
	public get centralNodeID(): number | string {
		return this._centralNodeID;
	}
	public set centralNodeID(centralNodeID: number | string) {
		this._centralNodeID = centralNodeID;
	}

	/**
	 * The __only instance__ of RectGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly rectShape: RectGlyphShape = new RectGlyphShape(this);
	/**
	 * The __only instance__ of CircleGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly circleShape: CircleGlyphShape = new CircleGlyphShape(this);
	/**
	 * The __only instance__ of LabelGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly labelShape: LabelGlyphShape = new LabelGlyphShape(this);
	/**
	 * The __only instance__ of SourceTargetLineGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly sourceTargetLineShape: SourceTargetLineGlyphShape = new SourceTargetLineGlyphShape(this);
	/**
	 * The __only instance__ of GestaltGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly gestaltShape: GestaltGlyphShape = new GestaltGlyphShape(this);
	/**
	 * The __only instance__ of VoronoiGroupGlyph in the entire code. Used to coordinate transitions
	 * as well as to draw regions when needed.
	 */
	readonly voronoiShape: VoronoiGroupGlyph = new VoronoiGroupGlyph();

	drawNodeGlyphs(): void { };
	drawEdgeGlyphs(): void { };
	drawAllNodeGlyphs(): void { };
	drawAllEdgeGlyphs(): void { };
	drawRegions(): void { }; //take an attr for color in draw method


	transformNodeGlyphsTo(shape: NodeGlyphShape): void { };
	transformEdgeGlyphsTo(shape: EdgeGlyphShape): void { };
	transformGroupGlyphsTo(shape: GroupGlyph): void { };

	removeNodeGlyphs(): void { };
	removeExitNodeGlyphs(): void { };
	removeEdgeGlyphs(): void { };
	removeExitEdgeGlyphs(): void { };
	removeRegions(): void { };


	enableStepping(): void { };
	disableStepping(): void { };
	enableEnterExitColoring(): void { };
	disableEnterExitColoring(): void { };
	drawTimesteps(): void { };
	removeTimesteps(): void { };


	positionNodesAndEdgesForceDirected(setRunning: boolean): void { };

	setCenterNode(centerNodeID: number | string): void { };

	positionNodeGlyphsMatrix(): void { };
	positionNodeGlyphsCartesian(): void { };
	positionNodeGlyphsPolar(): void { };
	//TODO: drop? positionNodeGlyphsGestalt(): void;
	positionEdgeGlyphsSourceTarget(): void { };
	positionEdgeGlyphsMatrix(): void { };
	positionEdgeGlyphsGestalt(): void { }; //matrix-y
	/*TODO: map of varibles/attrs
		fill
		stroke
		stroke-width
		radius
		opacity
		width, height
	*/
	setNodeGlyphAttrs(opts: AttrOpts): void { };
	setEdgeGlyphAttrs(opts: AttrOpts): void { };
	setRegionGlyphAttrs(opts: AttrOpts): void { };
	fixCentralNodePositions(bool: boolean): void { };
	redrawEgo(): void { };
}
