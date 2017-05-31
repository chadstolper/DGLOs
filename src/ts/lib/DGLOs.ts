import { Node } from "../model/DynamicGraph";

export interface DGLOs {
	drawNodeGlyphs(): void;
	drawEdgeGlyphs(): void;
	drawNewNodeGlyphs(): void;
	drawNewEdgeGlyphs(): void;
	drawRegions(): void;

	//TODO: Parameters
	transformNodeGlyphsTo(): void;
	transformEdgeGlyphsTo(): void;

	removeNodeGlyphs(): void;
	removeExitNodeGlyphs(): void;
	removeEdgeGlyphs(): void;
	removeExitEdgeGlyphs(): void;
	removeRegions(): void;



	enableStepping(): void;
	replicateTimesteps(): void;
	removeTimesteps(): void;

	restartSimulation(): void;
	stopSimulation(): void;

	setCenterNode(center: Node): void;

	//TODO: Parameters
	positionNodeGlyphs(): void;
	positionEdgeGlyphs(): void;

	//TODO: Parameters
	setNodeGlyphAttrs(): void;
	setEdgeGlyphAttrs(): void;
	setRegionGlyphAttrs(): void;






}