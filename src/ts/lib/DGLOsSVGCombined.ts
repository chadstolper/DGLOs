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
	protected _nodeG: Selection<any, {}, any, {}>;
	protected _nodeCircleGlyphs: Selection<any, {}, any, {}>;
	protected _nodeLabelGlyphs: Selection<any, {}, any, {}>;
	/**
	 * A map linking NodeGlyphShapes (defined in DGLOsSVGBaseClass) to their respective <g> tag selections (e.g. CircleNodes, LabelNodes etc).
	 */
	protected _nodeGlyphMap: Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * A map linking EdgeGlyphShapes (defined in DGLOsSVGBaseClass) to their respective <g> tag selections (e.g. rectEdges, STLineEdges etc).
	 */
	protected _edgeGlyphMap: Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * The overarching <g> tag holding the shape glyph selections (e.g. rectEdges, GestaltGlyphs, STLineEdges, etc..)
	 */
	protected _edgeG: Selection<any, {}, any, {}>
	/**  
	 * The overarching <g> tag holding the GroupGlyph selections.
	*/
	protected _groupGlyphG: Selection<any, {}, any, {}>;
	/**
	 * A map linking GroupGlyphs (defined in DGLOsSVGBaseClass) to their respective <g> tag selections (e.g. VoronoiPaths).
	 */
	protected _groupGlyphMap: Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>> = new Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>>();
	protected _colorScheme: ScaleOrdinal<string | number, string> = scaleOrdinal<string | number, string>(schemeCategory20);
	/**
	 * The physics simulation used to direct froce-directed visualizations.
	 */
	protected _simulation: Simulation<any, undefined>;
	protected _simulationEnabled: boolean = false;
	protected _multipleTimestepsEnabled: boolean = false;
	protected _matrixViewEnabled: boolean = false;
	protected _currentEdgeShape: EdgeGlyphShape = this.rectShape;
	protected _currentNodeShape: NodeGlyphShape = this.circleShape;
	protected _currentGroupGlyph: GroupGlyph = this.voronoiGroupGlyph;
	protected _voronoi: VoronoiLayout<Node> = d3.voronoi<Node>().extent([[-1000, -1000], [this._width + 1000, this._height + 1000]]) //set dimensions of voronoi
		.x(function (d: Node) { return d.x; })
		.y(function (d: Node) { return d.y; });
	protected _cardinalPoints: [number, number][] = [[0, 0], [this._width / 2, 0], [this._width, 0], [0, this._height / 2], [this._width, this._height / 2], [0, this._height], [this._width / 2, this._height], [this._height, this._width]];
	protected _noisePoints = [new Node("noise0", this._cardinalPoints.length + 0, "noise", "", 0), new Node("noise1", this._cardinalPoints.length + 1, "noise", "", 0), new Node("noise2", this._cardinalPoints.length + 2, "noise", "", 0), new Node("noise3", this._cardinalPoints.length + 3, "noise", "", 0), new Node("noise4", this._cardinalPoints.length + 4, "noise", "", 0), new Node("noise5", this._cardinalPoints.length + 5, "noise", "", 0), new Node("noise6", this._cardinalPoints.length + 6, "noise", "", 0), new Node("noise7", this._cardinalPoints.length + 7, "noise", "", 0)];
	protected _attrOpts: SVGAttrOpts = new SVGAttrOpts("id", "grey", 10, 2, null, null);
	protected _groupAttrOpts: SVGAttrOpts = new SVGAttrOpts("id", null, null, null);
	/**
	 * The AttrOpts object pertaining to edges. At this point, there is no difference between
	 * edgeAttrOpts and attrOpts. In the future, we will implement an EdgeAttrOpts and
	 * an NodeAttrOpts class. TODO.
	 */
	protected _edgeAttrOpts: SVGAttrOpts = new SVGAttrOpts("black", "black", null, 1, null, null, null);
	protected _willTestAttrOpts: SVGAttrOpts = new SVGAttrOpts("blue", "pink", null, 1, 20, 20, null);
	/**
	 * A map used for constructing an Egograph.
	 */
	protected _neighboringNodesMap: Map<string | number, Node> = new Map<string | number, Node>();
	/**
	 * An array holding all of the nodes that neighbor the central node.
	 */
	protected _nbrNodes: Array<Node>;
	/**
	 * An array holding all of the edges incident to the central node.
	 */
	protected _nbrEdges: Array<Edge>;
	/**
	 * An array holding all of the instances of the cnetral node across all timesteps.
	 */
	protected _centralNodeArray: Array<Node>;


	//TODO: MAKE ALL THE GETTERS! MAKE ALL THE SETTERS!
	set timeStampIndex(newTime: number) {
		this._timeStampIndex = newTime;
	}
	get timeStampIndex(): number {
		return this._timeStampIndex;
	}
	get nodeGlyphMap(): Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>> {
		return this._nodeGlyphMap;
	}
	get edgeGlyphMap(): Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>> {
		return this._edgeGlyphMap;
	}
	get groupGlyphMap(): Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>> {
		return this._groupGlyphMap;
	}
	set colorScheme(colorScheme: ScaleOrdinal<string | number, string>) {
		this._colorScheme = colorScheme;
	}
	get colorScheme(): ScaleOrdinal<string | number, string> {
		return this._colorScheme;
	}
	set simulation(newSim: Simulation<any, undefined>) {
		this._simulation = newSim;
	}
	get simulation(): Simulation<any, undefined> {
		return this._simulation;
	}
	set simulationEnabled(boo: boolean) {
		this._simulationEnabled = boo;
	}
	get simulationEnabled(): boolean {
		return this._simulationEnabled;
	}
	set multipleTimestepsEnabled(boo: boolean) {
		this._multipleTimestepsEnabled = boo;
	}
	get multipleTimestepsEnabled(): boolean {
		return this._multipleTimestepsEnabled;
	}
	set matrixViewEnabled(boo: boolean) {
		this._matrixViewEnabled = boo;
	}
	get matrixViewEnabled(): boolean {
		return this._matrixViewEnabled;
	}
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
	get voronoi(): VoronoiLayout<Node> {
		return this._voronoi;
	}
	get noisePoints(): Node[] {
		//give noisenodes (x, y) of cardinalPoints
		for (let i = 0; i < this._cardinalPoints.length; i++) {
			this._noisePoints[i].x = this._cardinalPoints[i][0];
			this._noisePoints[i].y = this._cardinalPoints[i][1];
		}
		return this._noisePoints;
	}
}