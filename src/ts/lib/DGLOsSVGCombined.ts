import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import { SVGAttrOpts } from "./DGLOsSVG";
import { VoronoiLayout, voronoi } from "d3-voronoi";

export class DGLOsSVGCombined extends DGLOsSVGBaseClass {

	/**
	 * Current timestep of the data.
	 */
	protected _timeStampIndex = 0;
	/**
	 * The overarching <g> tag holding the shape glyph selections
	 */
	protected _nodeG: Selection<any, {}, any, {}>;//TODO: still needed?
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by NodeGlyphShape.
	 * <SVG#, Map<NodeGlyphShape, Selection<any, {}, any, {}>>.
	 */
	protected _nodeGlyphMap: Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by EdgeGlyphShape.
	 * <SVG#, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>.
	 */
	protected _edgeGlyphMap: Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * The overarching <g> tag holding the shape glyph selections (e.g. rectEdges, GestaltGlyphs, STLineEdges, etc..)
	 */
	protected _edgeG: Selection<any, {}, any, {}> //TODO: still needed?
	/**  
	 * The overarching <g> tag holding the GroupGlyph selections.
	*/
	protected _groupGlyphG: Selection<any, {}, any, {}>; //TODO: still needed?
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by GroupGlyph.
	 * <SVG#, Map<GroupGlyph, Selection<any, {}, any, {}>>.
	 */
	protected _groupGlyphMap: Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>> = new Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>>();
	/**
	 * The physics simulation used to direct force-directed visualizations.
	 */
	protected _simulation: Simulation<any, undefined>;
	/**
	 * Boolean representing the existance of multiple SVG elements needing to be updated by timestep.
	 */
	protected _multipleTimestepsEnabled: boolean = false;
	/**
	 * Boolean representing the current DGLO visualization being displayed.
	 * Extended to Gestalt.
	 */
	protected _matrixViewEnabled: boolean = false;
	/**
	 * Boolean representing wheter enter exit animation is enabled on the current visualization.
	 */
	protected _enterExitTransitionEnabled: boolean = false;
	/**
	 * Holders for current shapes being used in the visualization.
	 */
	protected _currentEdgeShape: EdgeGlyphShape = this.rectShape;
	protected _currentNodeShape: NodeGlyphShape = this.circleShape;
	protected _currentGroupGlyph: GroupGlyph = this.voronoiGroupGlyph;
	/**
	 * Voronoi Tesselation mechanic holders.
	 * In case of rendering error, modify extent to larger values for calculations and Voronoi constraints.
	 */
	private readonly _voronoi: VoronoiLayout<Node> = voronoi<Node>().extent([[-1000, -1000], [this._width + 1000, this._height + 1000]])
		.x(function (d: Node) { return d.x; })
		.y(function (d: Node) { return d.y; });
	protected _noisePoints: Node[] = this.setNoisePoints();
	/**
	 * see comment by will //TODO: rewrite, see comment in edgeattropts
	 */
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
	set simulation(newSim: Simulation<any, undefined>) {
		this._simulation = newSim;
	}
	get simulation(): Simulation<any, undefined> {
		return this._simulation;
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
	set enterExitTransitionEnabled(boo: boolean) {
		this._enterExitTransitionEnabled = boo;
	}
	get enterExitTransitionEnabled(): boolean {
		return this._enterExitTransitionEnabled;
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
		return this._noisePoints;
	}

	/**
	 * Initializes the noiseNodes[Node]. Random new nodes assigned with fixed x and y values along border.
	 */
	protected setNoisePoints(): Node[] {
		let newNoiseNodes: Node[] = new Array<Node>();
		let iterator = 0;
		let limit = ((this._width + this._height) / 2) / 100 * 5;
		while (iterator < limit) {
			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 0), iterator + 0, "noise", "", 0)); //top
			newNoiseNodes[iterator + 0].x = Math.floor((Math.random() * this._width) + 1);
			newNoiseNodes[iterator + 0].y = 0;

			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 1), iterator + 1, "noise", "", 0)); //bottom
			newNoiseNodes[iterator + 1].x = Math.floor((Math.random() * this._width) + 1);
			newNoiseNodes[iterator + 1].y = this._height;

			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 2), iterator + 2, "noise", "", 0)); //left
			newNoiseNodes[iterator + 2].x = 0;
			newNoiseNodes[iterator + 2].y = Math.floor((Math.random() * this._height) + 1);

			newNoiseNodes.push(new Node("NoiseNode" + (iterator + 3), iterator + 3, "noise", "", 0)); //right
			newNoiseNodes[iterator + 3].x = this._width;
			newNoiseNodes[iterator + 3].y = Math.floor((Math.random() * this._height) + 1);
			iterator += 4;
		}
		return newNoiseNodes;
	}
}