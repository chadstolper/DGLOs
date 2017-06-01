import { DGLOs, NodeGlyphShape, EdgeGlyphShape, AttrOpts } from "./DGLOs";
import * as model from "../model/DynamicGraph";
import * as shape from "./ShapeClasses";

export class DGLOsSVGBaseClass implements DGLOs {
	data: model.DynamicGraph;

	readonly rectShape: shape.RectGlyphShape;
	readonly circleShape: shape.CircleGlyphShape;
	readonly labelShape: shape.LabelGlyphShape;
	readonly sourceTargetLineShape: shape.SourceTargetLineGlyphShape;
	readonly gestaltShape: shape.GestaltGlyphShape;

	public drawNodeGlyphs(): void { };
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
