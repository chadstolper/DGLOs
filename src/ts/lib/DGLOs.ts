import { Node } from "../model/DynamicGraph";

export interface DGLOs {

	/*TODO:
		data via graph
			 via [] of nodes/edges
			 via visa
	*/
	drawNodeGlyphs(): void;
	drawEdgeGlyphs(): void;
	drawNewNodeGlyphs(): void;
	drawNewEdgeGlyphs(): void;
	drawRegions(): void;

	/*TODO: add a label parameter to transformNodeGlyphsTo()
	*/
	transformNodeGlyphsTo(): void;
	transformEdgeGlyphsTo(): void;

	/*TODO:
		data via graph
			 via [] of nodes/edges
			 via visa?
	*/
	removeNodeGlyphs(): void;
	removeExitNodeGlyphs(): void;
	removeEdgeGlyphs(): void;
	removeExitEdgeGlyphs(): void;
	removeRegions(): void;


	/*TODO
		boolean
		number to pick timestep to keep? default to [0]
	*/
	enableStepping(): void;
	replicateTimesteps(): void;
	removeTimesteps(): void;

	/*TODO:
	*/
	restartSimulation(): void;
	stopSimulation(): void;

	setCenterNode(center: Node): void;

	/*TODO: Parameters
	*/
	positionNodeGlyphsMatrix(): void;
	positionNodeGlyphsCartesian(): void;
	positionNodeGlyphsPolar(): void;
	positionEdgeGlyphs(): void;

	/*TODO: map of varibles/attrs
		color
		fill
		stroke
		stroke width
		radius
		opacity
	*/
	setNodeGlyphAttrs(): void;
	setEdgeGlyphAttrs(): void;
	setRegionGlyphAttrs(): void;

}