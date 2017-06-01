import { DGLOs, NodeGlyphShape, EdgeGlyphShape, AttrOpts } from "./DGLOs";
import * as model from "../model/DynamicGraph";
import * as shape from "./ShapeClasses";

import { DynamicGraph } from "../model/DynamicGraph";
import { Selection } from "d3-selection";


export class DGLOsSVGBaseClass implements DGLOs {
	protected _data: model.DynamicGraph;
	protected _location: Selection<any, {}, any, {}>;

	public get data(): model.DynamicGraph {
		return this._data;
	}

	public get loc(): Selection<any, {}, any, {}> {
		return this._location;
	}

	constructor(data: DynamicGraph, location: Selection<any, {}, any, {}>) {
		this._data = data;
		this._location = location;
	}

	readonly rectShape: shape.RectGlyphShape;
	readonly circleShape: shape.CircleGlyphShape;
	readonly labelShape: shape.LabelGlyphShape;
	readonly sourceTargetLineShape: shape.SourceTargetLineGlyphShape;
	readonly gestaltShape: shape.GestaltGlyphShape;

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
