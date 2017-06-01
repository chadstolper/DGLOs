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

	/**
	 * Draw all NodeGlyphs in a given data set at the current timestep.
	 * Draws all Nodes regardless of duplicates or exiting Nodes.
	 * Returns void.
	 */
	drawNodeGlyphs(): void;
	/**
	 * Draw all EdgeGlyphs in a given data set at the current timestep.
	 * Draws all Edges regardless of duplicats or exiting Edges.
	 * Returns Void.
	 */
	drawEdgeGlyphs(): void;
	/**
	 * Draw entering Nodes from another timestep. Acts as an update to an existing graphic.
	 * Returns void.
	 */
	drawNewNodeGlyphs(): void;
	/**
	 * Draw entering Edges from another timestep. Acts as an update to an existing graphic.
	 * Returns void.
	 */
	drawNewEdgeGlyphs(): void;
	/**
	 * Draw Voronoi Tesselation paths and fill them with a color. 
	 * Color will defualt to #00000.
	 * Returns void.
	 */
	drawRegions(): void;
	/**
	 * Morphs NodeGlyph visual representation to another visualization
	 * Accepts NodeGlyphShape(attr, attr).	  
	 * Returns void.
	 */
	transformNodeGlyphsTo(shape: NodeGlyphShape): void;
	/**
	 * Morphs EdgeGlyph visual representation to another visualization
	 * Accepts EdgeGlyphShape(attr, attr).
	 * Returns void.
	 */
	transformEdgeGlyphsTo(shape: EdgeGlyphShape): void;
	/**
	 * Removes __all__ NodeGlyphs.
	 * Returns void.
	 */
	removeNodeGlyphs(): void;
	/**
	 * Removes exiting or leaving Node visualizations not present in new data.
	 * Returns void.
	 */
	removeExitNodeGlyphs(): void;
	/**
	 * Removes __all__ EdgeGlyphs.
	 * Returns void.
	 */
	removeEdgeGlyphs(): void;
	/**
	 * Removes exiting or leaving Edge visualizations not present in new data.
	 * Returns void.
	 */
	removeExitEdgeGlyphs(): void;
	/**
	 * Removes __all__ Voronoi Tesselation from the graphic.
	 * Returns void.
	 */
	removeRegions(): void;

	/**
	 * Enables some manner of animation between two timesteps
	 * Returns void.
	 */
	enableStepping(): void;
	/**
	 * Disables animation between timesteps.
	 * Returns void.
	 */
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