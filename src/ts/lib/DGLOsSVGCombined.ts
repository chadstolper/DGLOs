import { DGLOsSVGBaseClass } from "./DGLOsSVGBaseClass";
import { Selection } from "d3-selection";
import { Node, Edge } from "../model/dynamicgraph";
import { Simulation } from "d3-force";
import { NodeGlyphShape } from "./NodeGlyphInterface"
import { EdgeGlyphShape } from "./EdgeGlyphInterface";
import { GroupGlyph } from "./GroupGlyphInterface";
import { SVGAttrOpts } from "./DGLOsSVG";
import { SimulationAttrOpts } from "./DGLOsSimulation";
import { VoronoiLayout, voronoi } from "d3-voronoi";

export class DGLOsSVGCombined extends DGLOsSVGBaseClass {

	/**
	 * Current timestep of the data.
	 */
	private _timeStampIndex: number = 0;
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by NodeGlyphShape.
	 * <SVG#, Map<NodeGlyphShape, Selection<any, {}, any, {}>>.
	 */
	private _nodeGlyphMap: Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<NodeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by EdgeGlyphShape.
	 * <SVG#, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>.
	 */
	private _edgeGlyphMap: Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>> = new Map<number, Map<EdgeGlyphShape, Selection<any, {}, any, {}>>>();
	/**
	 * A map of SVG related maps with pointers to their respective <g> tag selection by GroupGlyph.
	 * <SVG#, Map<GroupGlyph, Selection<any, {}, any, {}>>.
	 */
	private _groupGlyphMap: Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>> = new Map<number, Map<GroupGlyph, Selection<any, {}, any, {}>>>();
	/**
	 * The physics simulation used to direct force-directed visualizations.
	 */
	private _simulation: Simulation<any, undefined>;
	/**
	 * Boolean representing the existance of multiple SVG elements needing to be updated by timestep.
	 */
	private _multipleTimestepsEnabled: boolean = false;
	/**
	 * Boolean representing the current DGLO visualization being displayed.
	 * Extended to Gestalt.
	 */
	private _matrixViewEnabled: boolean = false;
	/**
	 * Boolean representing if enter exit coloring is enabled on the current visualization.
	 */
	private _enterExitColorEnabled: boolean = false;

	/**
	 * Holders for current shapes being used in the visualization.
	 */
	private _currentEdgeShape: EdgeGlyphShape = this.rectShape;
	private _currentNodeShape: NodeGlyphShape = this.circleShape;
	private _currentGroupGlyph: GroupGlyph = this.voronoiShape;
	/**
	 * Voronoi Tesselation mechanic holders.
	 * In case of rendering error, modify extent to larger values for calculations and Voronoi constraints.
	 */
	private readonly _voronoi: VoronoiLayout<Node> = voronoi<Node>().extent([[-this.width, -this.height], [this.width * 2, this.height * 2]])
		.x(function (d: Node): number { return d.x; })
		.y(function (d: Node): number { return d.y; });
	/**
	 * Array of random points held as an array for vornoi calculations and GMap visualization.
	 */
	private _noisePoints: Node[] = this.setNoisePoints();
	/**
	 * Attributes pertaining to SVG visualization.
	 */
	private _attrOpts: SVGAttrOpts = new SVGAttrOpts("white", "black", "black");
	/**
	 * Attributes pertaining to the simulation. Empty constructor defaults.
	 */
	private _simulationAttrOpts: SimulationAttrOpts = new SimulationAttrOpts();
	/**
	 * A map used for constructing an Egograph.
	 */
	private _neighboringNodesMap: Map<string | number, Node> = new Map<string | number, Node>();
	/**
	 * An array holding all of the nodes that neighbor the central node.
	 */
	private _nbrNodes: Array<Node>;
	/**
	 * An array holding all of the edges incident to the central node.
	 */
	private _nbrEdges: Array<Edge>;
	/**
	 * An array holding all of the instances of the cnetral node across all timesteps.
	 */
	private _centralNodeArray: Array<Node>;

	/**
	 * Initializes the noiseNodes[Node]. Random new nodes assigned with fixed x and y values along border.
	 */
	private setNoisePoints(): Node[] {
		let newNoiseNodes: Node[] = new Array<Node>();
		let iterator: number = 0;
		let limit: number = ((this.width + this.height) / 2) / 100 * 5;
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

	set timeStampIndex(num: number) {
		this._timeStampIndex = num;
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
	set enterExitColorEnabled(boo: boolean) {
		this._enterExitColorEnabled = boo;
	}
	get enterExitColorEnabled(): boolean {
		return this._enterExitColorEnabled;
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
	set currentGroupGlyph(shape: GroupGlyph) {
		this._currentGroupGlyph = shape;
	}
	get currentGroupGlyph(): GroupGlyph {
		return this._currentGroupGlyph;
	}
	get voronoi(): VoronoiLayout<Node> {
		return this._voronoi;
	}
	get noisePoints(): Node[] {
		return this._noisePoints;
	}
	set attrOpts(attr: SVGAttrOpts) {
		this._attrOpts = attr;
	}
	get attrOpts(): SVGAttrOpts {
		return this._attrOpts;
	}
	set simulationAttrOpts(attr: SimulationAttrOpts) {
		this._simulationAttrOpts = attr;
	}
	get simulationAttrOpts(): SimulationAttrOpts {
		return this._simulationAttrOpts;
	}
	set neighboringNodesMap(map: Map<string | number, Node>) {
		this._neighboringNodesMap = map;
	}
	get neighboringNodesMap(): Map<string | number, Node> {
		return this._neighboringNodesMap;
	}
	set nbrNodes(arr: Array<Node>) {
		this._nbrNodes = arr;
	}
	get nbrNodes(): Array<Node> {
		return this._nbrNodes;
	}
	set nbrEdges(arr: Array<Edge>) {
		this._nbrEdges = arr;
	}
	get nbrEdges(): Array<Edge> {
		return this._nbrEdges;
	}
	set centralNodeArray(arr: Array<Node>) {
		this._centralNodeArray = arr;
	}
	get centralNodeArray(): Array<Node> {
		return this._centralNodeArray;
	}
}