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
	/**
	 * Aligns the current edges in the graph so that they
	 * are in position to form a Gestalt Graph. 
	 */
	positionEdgeGlyphsGestalt(): void; //matrix-y

	/**
	 * Takes a map of variables and applies them to the nodes
	 * present in the current visualization. Examples include
	 * color and size.
	 */
	setNodeGlyphAttrs(opts: AttrOpts): void;
	/**
	 * Takes a map of variables and applies them to the edges
	 * present in the current visualization. Examples include line-thickness
	 * and color.
	 */
	setEdgeGlyphAttrs(opts: AttrOpts): void;
	/**
	 * Takes a map of variables and applies them to the regions 
	 * present in the current visualization. Color is an example of an
	 * attribute that can be assigned to regionGlyphs. 
	 */
	setRegionGlyphAttrs(opts: AttrOpts): void;

}