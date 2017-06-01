import { DynamicGraph, Node } from "../model/DynamicGraph";
import { NodeGlyphShape, EdgeGlyphShape, AttrOpts } from "./LibDependencies";
import { RectGlyphShape, CircleGlyphShape, LabelGlyphShape, SourceTargetLineGlyphShape, GestaltGlyphShape } from "./TodoClasses";

export interface DGLOs {

	data: DynamicGraph;

	readonly rectShape: RectGlyphShape;
	readonly circleShape: CircleGlyphShape;
	readonly labelShape: LabelGlyphShape;
	readonly sourceTargetLineShape: SourceTargetLineGlyphShape;
	readonly gestaltShape: GestaltGlyphShape;

	drawNodeGlyphs(): void;
	drawEdgeGlyphs(): void;
	drawNewNodeGlyphs(): void;
	drawNewEdgeGlyphs(): void;
	drawRegions(): void; //take an attr for color in draw method


	transformNodeGlyphsTo(shape: NodeGlyphShape): void;
	transformEdgeGlyphsTo(shape: EdgeGlyphShape): void;

	removeNodeGlyphs(): void;
	removeExitNodeGlyphs(): void;
	removeEdgeGlyphs(): void;
	removeExitEdgeGlyphs(): void;
	removeRegions(): void;


	enableStepping(): void;
	disableStepping(): void;
	replicateTimesteps(): void;
	removeTimesteps(): void;


	runSimulation(): void;
	stopSimulation(): void;

	setCenterNode(center: Node): void;

	/*TODO: Parameters
	*/
	positionNodeGlyphsMatrix(): void;
	positionNodeGlyphsCartesian(): void;
	positionNodeGlyphsPolar(): void;
	//TODO: drop? positionNodeGlyphsGestalt(): void;
	positionEdgeGlyphsSourceTarget(): void;
	positionEdgeGlyphsMatrix(): void;
	positionEdgeGlyphsGestalt(): void; //matrix-y

	/*TODO: map of varibles/attrs
		fill
		stroke
		stroke-width
		radius
		opacity
		width, height
	*/
	setNodeGlyphAttrs(opts: AttrOpts): void;
	setEdgeGlyphAttrs(opts: AttrOpts): void;
	setRegionGlyphAttrs(opts: AttrOpts): void;

}