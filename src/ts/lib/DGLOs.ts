import { DynamicGraph } from "../model/DynamicGraph";

import { RectGlyphShape } from "./shapes/RectGlyphShape";
import { CircleGlyphShape } from "./shapes/CircleGlyphShape";
import { LabelGlyphShape } from "./shapes/LabelGlyphShape";
import { SourceTargetLineGlyphShape } from "./shapes/SourceTargetLineGlyphShape";
import { GestaltGlyphShape } from "./shapes/GestaltGlyphShape";
import { VoronoiGroupGlyph } from "./shapes/VoronoiGroupGlyph";

import { Selection } from "d3-selection";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";

export interface AttrOpts { }

export interface DGLOs {

	data: DynamicGraph;
	location: Selection<any, {}, any, {}>;
	drawLocation: Selection<any, {}, any, {}>;
	width: number;
	height: number;

	readonly rectShape: RectGlyphShape;
	readonly circleShape: CircleGlyphShape;
	readonly labelShape: LabelGlyphShape;
	readonly sourceTargetLineShape: SourceTargetLineGlyphShape;
	readonly gestaltShape: GestaltGlyphShape;
	readonly voronoiShape: VoronoiGroupGlyph;

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
	 * Draws all of the node glyphs of a certain shape for every timestep.
	 * Returns void.
	 */
	drawAllNodeGlyphs(): void;


	/**
	 * Draws all of the edge glyphs of a certain shape for every timestep.
	 * returns void.
	 */
	drawAllEdgeGlyphs(): void;


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
	 * Morphs GroupGlyph visual representation to another visualization
	 * Accepts GroupGlyphShape.
	 * Returns void.
	 */
	transformGroupGlyphsTo(shape: GroupGlyph): void;


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


	/**
	 * Enables coloring showing entering and exiting data at a given timestep.
	 * Returns void.
	 */
	enableEnterExitColoring(): void;


	/**
	 * Disables coloring of entering and exiting data.
	 */
	disableEnterExitColoring(): void;


	/**
	 * Draws a graph visualization of the current form for every timestep
	 * in the timeline.
	 */
	drawTimesteps(): void;


	/**
	 * Removes all but one graph visualization from a series of graph 
	 * visualizations.
	 */
	removeTimesteps(): void;

	/**
	 * Starts running a node positioning simulation.
	 */
	positionNodesAndEdgesForceDirected(setRunning: boolean): void;

	/**
	 * Sets the central node for a Dynamic Graph. This is used 
	 * for creating Ego Graphs.
	 */
	setCenterNode(centerNodeID: number | string): void;


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


	/**
	 * Takes a map of varibles and applies them to the simulation
	 * to enable or disable certain calculations and change related values.
	 */
	setSimulationAttrs(opts: AttrOpts): void;


	fixCentralNodePositions(bool: boolean): void;
}