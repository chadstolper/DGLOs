import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape, EdgeGlyphShape } from "./DGLOs";

export class DGLOsSVGCombined extends DGLOsSVGBaseClass {

	_nodeG: Selection<any, {}, any, {}>;
	_nodeCircleGlyphs: Selection<any, {}, any, {}>;
	_nodeLabelGlyphs: Selection<any, {}, any, {}>;
	_edgeG: Selection<any, {}, any, {}>
	_edgeGlyphs: Selection<any, {}, any, {}>;
	_edgeLineGlyphs: Selection<any, {}, any, {}>;
	_edgeRectGlyphs: Selection<any, {}, any, {}>;
	_timeStampIndex = 0;
	_colorScheme: ScaleOrdinal<string | number, string> = scaleOrdinal<string | number, string>(schemeCategory20);
	_simulation: Simulation<any, undefined>
	_height = 500;
	_width = 500;
	_radius = 10;
	_stroke = "#0000";
	_fill = "#0000";
	_stroke_width = 2
	_opacity = 100;
	_currentEdgeShape: EdgeGlyphShape;
	_currentNodeShape: NodeGlyphShape;

}