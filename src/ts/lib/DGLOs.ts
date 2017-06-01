import { DynamicGraph, Node } from "../model/DynamicGraph";
import { RectGlyphShape, CircleGlyphShape, LabelGlyphShape, SourceTargetLineGlyphShape, GestaltGlyphShape } from "./ShapeClasses";


export interface NodeGlyphShape { }
export interface EdgeGlyphShape { }

/**
 * TODO: map of varibles/attrs:
	- fill
	- stroke
	- stroke-width
	- radius
	- opacity
	 - width, height
 */
export interface AttrOpts { }

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

	/**
	 * Aligns the current nodes in the graph so that they
	 * are in position to serve as labels for a matrix.
	 */
	positionNodeGlyphsMatrix(): void;
	/**
	 * Positions the current nodes in the graph using a
	 * Cartesian coordinate scheme.
	 */
	positionNodeGlyphsCartesian(): void;
	/**
	 * Positions the current nodes in the graph using a polar
	 * coordinate scheme.
	 */
	positionNodeGlyphsPolar(): void;
	//TODO: drop? positionNodeGlyphsGestalt(): void;
	/**
	 * Aligns the current edges in the graph so that
	 * they point from source to target. 
	 */
	positionEdgeGlyphsSourceTarget(): void;
	/**
	 * Aligns the current edges in the graph so that they
	 * are in position to form a matrix.
	 */
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