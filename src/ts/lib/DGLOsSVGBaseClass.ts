import { DGLOs, AttrOpts } from "./DGLOs";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
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
	protected _height = 500;
	protected _width = 500;

	public get data(): model.DynamicGraph {
		return this._data;
	}

	public get loc(): Selection<any, {}, any, {}> {
		return this._location;
	}

	constructor(data: DynamicGraph, location: Selection<any, {}, any, {}>) {
		this._data = data;
		this._location = location;
		if (location.attr("width")) { this._width = +location.attr("width"); }
		if (location.attr("height")) { this._width = +location.attr("height"); }

	}
	/**
	 * The __only instance__ of RectGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly rectShape: RectGlyphShape = new RectGlyphShape();
	/**
	 * The __only instance__ of CircleGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly circleShape: CircleGlyphShape = new CircleGlyphShape();
	/**
	 * The __only instance__ of LabelGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly labelShape: LabelGlyphShape = new LabelGlyphShape();
	/**
	 * The __only instance__ of SourceTargetLineGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly sourceTargetLineShape: SourceTargetLineGlyphShape = new SourceTargetLineGlyphShape();
	/**
	 * The __only instance__ of GestaltGlyphShape in the entire code. Used to coordinate transitions
	 * as well as to draw rectangles when needed.
	 */
	readonly gestaltShape: GestaltGlyphShape = new GestaltGlyphShape();
	/**
	 * The __only instance__ of VoronoiGroupGlyph in the entire code. Used to coordinate transitions
	 * as well as to draw regions when needed.
	 */
	readonly voronoiGroupGlyph: VoronoiGroupGlyph = new VoronoiGroupGlyph();

	drawNodeGlyphs(): void { };
	drawEdgeGlyphs(): void { };
	drawNewNodeGlyphs(): void { };
	drawNewEdgeGlyphs(): void { };
	drawRegions(): void { }; //take an attr for color in draw method


	transformNodeGlyphsTo(shape: NodeGlyphShape): void { };
	transformEdgeGlyphsTo(shape: EdgeGlyphShape): void { };

	removeNodeGlyphs(): void { };
	removeExitNodeGlyphs(): void { };
	removeEdgeGlyphs(): void { };
	removeExitEdgeGlyphs(): void { };
	removeRegions(): void { };


	enableStepping(): void { };
	disableStepping(): void { };
	replicateTimesteps(): void { };
	removeTimesteps(): void { };


	runSimulation(): void { };
	stopSimulation(): void { };

	setCenterNode(center: model.Node): void { };

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
}
