import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20b } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";

export class DGLOsSVGCombinedBase extends DGLOsSVGBaseClass {

	_nodeG: Selection<any, {}, any, {}>;
	_nodeGlyphs: Selection<any, {}, any, {}>;
	_edgeG: Selection<any, {}, any, {}>
	_edgeGlyphs: Selection<any, {}, any, {}>;
	_timeStampIndex = 0;
	_colorScheme: ScaleOrdinal<string | number, string> = scaleOrdinal<string | number, string>(schemeCategory20b);
	_simulation: Simulation<any, undefined>
	_height = 500;
	_width = 500;

}