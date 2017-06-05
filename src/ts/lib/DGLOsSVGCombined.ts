import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
export class DGLOsSVGCombined extends DGLOsSVGBaseClass {

	_nodeG: Selection<any, {}, any, {}>;
	_nodeCircleGlyphs: Selection<any, {}, any, {}>;
	_nodeLabelGlyphs: Selection<any, {}, any, {}>;
	_nodeGlyphs: Selection<any, {}, any, {}>;
	_edgeG: Selection<any, {}, any, {}>
	_edgeLineGlyphs: Selection<any, {}, any, {}>;
	_edgeRectGlyphs: Selection<any, {}, any, {}>;
	_edgeGestaltGlyphs: Selection<any, {}, any, {}>;
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

	set currentEdgeShape(shape: EdgeGlyphShape) {
		this._currentEdgeShape = shape;
	}
	get currentEdgeShape(): EdgeGlyphShape {
		return this._currentEdgeShape;
	}
	set currentNodeShape(shape: NodeGlyphShape) {
		this._currentNodeShape = shape;
	}
	get currentNodeShape(): NodeGlyphShape {
		return this._currentNodeShape;
	}

}