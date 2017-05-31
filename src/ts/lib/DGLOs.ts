import { Node } from "../model/DynamicGraph";

export interface DGLOs {
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
	*/
	removeNodeGlyphs(): void;
	removeExitNodeGlyphs(): void;
	removeEdgeGlyphs(): void;
	removeExitEdgeGlyphs(): void;
	removeRegions(): void;


	/*TODO
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

	/*TODO: Parameters
	*/
	setNodeGlyphAttrs(): void;
	setEdgeGlyphAttrs(): void;
	setRegionGlyphAttrs(): void;

}