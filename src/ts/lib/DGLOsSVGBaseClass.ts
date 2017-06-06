import { DGLOs, AttrOpts } from "./DGLOs";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import * as model from "../model/DynamicGraph";

import { RectGlyphShape } from "./shapes/RectGlyphShape";
import { CircleGlyphShape } from "./shapes/CircleGlyphShape";
import { LabelGlyphShape } from "./shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "./shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "./shapes/GestaltGlyphShape";

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

	readonly rectShape: RectGlyphShape = new RectGlyphShape();
	readonly circleShape: CircleGlyphShape = new CircleGlyphShape();
	readonly labelShape: LabelGlyphShape = new LabelGlyphShape();
	readonly sourceTargetLineShape: SourceTargetLineGlyphShape = new SourceTargetLineGlyphShape();
	readonly gestaltShape: GestaltGlyphShape = new GestaltGlyphShape();

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
