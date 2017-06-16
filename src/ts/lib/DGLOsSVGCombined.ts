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
import * as d3 from "d3"; //TODO: replace later with module for voronoi

export class DGLOsSVGCombined extends DGLOsSVGBaseClass {

	/**
	 * Current timestep of the data.
	 */
	protected _timeStampIndex = 0;
	/**
	 * The overarching <g> tag holding the shape glyph selections
	 */
	protected _nodeG: Selection<any, {}, any, {}>;
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
	 * Holders for current shapes being used in the visualization.
	 */
	protected _currentEdgeShape: EdgeGlyphShape = this.rectShape;
	protected _currentNodeShape: NodeGlyphShape = this.circleShape;
	protected _currentGroupGlyph: GroupGlyph = this.voronoiGroupGlyph;
	/**
	 * Voronoi Tesselation mechanic holders.
	 * DO NOT MODIFY.
	 */
	private readonly _voronoi: VoronoiLayout<Node> = d3.voronoi<Node>().extent([[-1000, -1000], [this._width + 1000, this._height + 1000]]) //set dimensions of voronoi
		.x(function (d: Node) { return d.x; })
		.y(function (d: Node) { return d.y; });
	protected readonly _cardinalPoints: [number, number][] = [[0, 0], [this._width / 2, 0], [this._width, 0], [0, this._height / 2], [this._width, this._height / 2], [0, this._height], [this._width / 2, this._height], [this._height, this._width]];
	protected _noisePoints: Node[] = this.setNoisePoints();// = [new Node("noise0", this._cardinalPoints.length + 0, "noise", "", 0), new Node("noise1", this._cardinalPoints.length + 1, "noise", "", 0), new Node("noise2", this._cardinalPoints.length + 2, "noise", "", 0), new Node("noise3", this._cardinalPoints.length + 3, "noise", "", 0), new Node("noise4", this._cardinalPoints.length + 4, "noise", "", 0), new Node("noise5", this._cardinalPoints.length + 5, "noise", "", 0), new Node("noise6", this._cardinalPoints.length + 6, "noise", "", 0), new Node("noise7", this._cardinalPoints.length + 7, "noise", "", 0)];
	/**
	 * see comment by will
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
	/**
	 * Returns the noisePoints[Node] with x and y positions provided by cardinalPoints[Number][].
	 * Used in GMap(Voronoi) visualization.
	 */
	get noisePoints(): Node[] {
		// this.setNoisePoints();
		// for (let i = 0; i < this._noisePoints.length; i++) {
		// 	this._noisePoints[i].x = this._cardinalPoints[i][0];
		// 	this._noisePoints[i].y = this._cardinalPoints[i][1];
		// }
		return this._noisePoints;
	}

	/**
	 * Initializes the noiseNodes. Random new nodes assigned with fixed x and y values along border.
	 */
	protected setNoisePoints(): Node[] {
		let turnUpTheNoise: Node[] = new Array<Node>();
		let iterator = 0;
		let limit = ((this._width + this._height) / 2) / 100 * 5;
		while (iterator < limit) {
			turnUpTheNoise.push(new Node("NoiseNode" + (iterator + 0), iterator + 0, "noise", "", 0)); //top
			turnUpTheNoise[iterator + 0].x = Math.floor((Math.random() * this._width) + 1);
			turnUpTheNoise[iterator + 0].y = 0;

			turnUpTheNoise.push(new Node("NoiseNode" + (iterator + 1), iterator + 1, "noise", "", 0)); //bottom
			turnUpTheNoise[iterator + 1].x = Math.floor((Math.random() * this._width) + 1);
			turnUpTheNoise[iterator + 1].y = this._height;

			turnUpTheNoise.push(new Node("NoiseNode" + (iterator + 2), iterator + 2, "noise", "", 0)); //left
			turnUpTheNoise[iterator + 2].x = 0;
			turnUpTheNoise[iterator + 2].y = Math.floor((Math.random() * this._height) + 1);

			turnUpTheNoise.push(new Node("NoiseNode" + (iterator + 3), iterator + 3, "noise", "", 0)); //right
			turnUpTheNoise[iterator + 3].x = this._width;
			turnUpTheNoise[iterator + 3].y = Math.floor((Math.random() * this._height) + 1);
			iterator += 4;
		}
		return turnUpTheNoise;
	}
}