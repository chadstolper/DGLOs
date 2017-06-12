import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { ScaleOrdinal, scaleOrdinal, schemeCategory20 } from "d3-scale";
import * as d3force from "d3-force";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import { SVGAttrOpts } from "./DGLOsSVG";
import { VoronoiLayout } from "d3-voronoi";
import * as d3 from "d3"; //TODO: replace later with module

export class DGLOsSVGCombined extends DGLOsSVGBaseClass {

	protected _timeStampIndex = 0;


	/**
	 * The overarching <g> tag holding the shape glyph selections
	 */
	_nodeG: Selection<any, {}, any, {}>;
	_nodeCircleGlyphs: Selection<any, {}, any, {}>;
	_nodeLabelGlyphs: Selection<any, {}, any, {}>;
	/**
	 * A map linking NodeGlyphShapes (defined in DGLOsSVGBaseClass) to their respective <g> tag selections (e.g. CircleNodes, LabelNodes etc).
	 */
	_nodeGlyphMap: Map<NodeGlyphShape, Selection<any, {}, any, {}>> = new Map<NodeGlyphShape, Selection<any, {}, any, {}>>();
	_nodeGlyphMapMap: Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * A map linking EdgeGlyphShapes (defined in DGLOsSVGBaseClass) to their respective <g> tag selections (e.g. rectEdges, STLineEdges etc).
	 */
	_edgeGlyphMap: Map<EdgeGlyphShape, Selection<any, {}, any, {}>> = new Map<EdgeGlyphShape, Selection<any, {}, any, {}>>();
	/**
	 * The overarching <g> tag holding the shape glyph selections (e.g. rectEdges, GestaltGlyphs, STLineEdges, etc..)
	 */
	_edgeG: Selection<any, {}, any, {}>
	/**  
	 * The overarching <g> tag holding the GroupGlyph selections.
	*/
	_groupGlyphG: Selection<any, {}, any, {}>;
	/**
	 * A map linking GroupGlyphs (defined in DGLOsSVGBaseClass) to their respective <g> tag selections (e.g. VoronoiPaths).
	 */
	_groupGlyphMap: Map<GroupGlyph, Selection<any, {}, any, {}>> = new Map<GroupGlyph, Selection<any, {}, any, {}>>();
	_colorScheme: ScaleOrdinal<string | number, string> = scaleOrdinal<string | number, string>(schemeCategory20);
	/**
	 * The physics simulation used to direct froce-directed visualizations.
	 */
	_simulation: Simulation<any, undefined>;
	_simulationEnabled: boolean = false;
	_metaSimulation: Simulation<any, undefined>;
	_simulationMap: Map<number, Simulation<any, undefined>> = new Map<number, Simulation<any, undefined>>();
	_currentEdgeShape: EdgeGlyphShape = this.rectShape;
	_currentNodeShape: NodeGlyphShape = this.circleShape;
	_currentGroupGlyph: GroupGlyph;
	_voronoi: VoronoiLayout<Node> = d3.voronoi<Node>().extent([[-1000, -1000], [this._width + 1000, this._height + 1000]]) //set dimensions of voronoi
		.x(function (d: Node) { return d.x; })
		.y(function (d: Node) { return d.y; });
	_cardinalPoints: [number, number][];
	_noisePoints: Node[];
	_attrOpts: SVGAttrOpts = new SVGAttrOpts("id", "grey", 10, 2, null, null);
	_groupAttrOpts: SVGAttrOpts = new SVGAttrOpts("id", null, null, null);
	/**
	 * The AttrOpts object pertaining to edges. At this point, there is no difference between
	 * edgeAttrOpts and attrOpts. In the future, we will implement an EdgeAttrOpts and
	 * an NodeAttrOpts class. TODO.
	 */
	_edgeAttrOpts: SVGAttrOpts = new SVGAttrOpts(null, null, null, null, null, null, null);
	_willTestAttrOpts: SVGAttrOpts = new SVGAttrOpts("blue", "pink", null, 1, 20, 20, null);
	/**
	 * A map used for constructing an Egograph.
	 */
	_neighboringNodesMap: Map<string | number, Node> = new Map<string | number, Node>();
	/**
	 * An array holding all of the nodes that neighbor the central node.
	 */
	_nbrNodes: Array<Node>;
	/**
	 * An array holding all of the edges incident to the central node.
	 */
	_nbrEdges: Array<Edge>;
	/**
	 * An array holding all of the instances of the cnetral node across all timesteps.
	 */
	_centralNodeArray: Array<Node>;


	//TODO: MAKE ALL THE GETTERS! MAKE ALL THE SETTERS!

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