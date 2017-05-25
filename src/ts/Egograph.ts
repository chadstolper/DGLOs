import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./ForceDirectedGraph"
import { Selection } from "d3-selection";
import { DrawableEdge } from "./DrawableEdge";
import * as d3Scale from "d3-scale";
import * as d3 from "d3-selection";
import * as d3force from "d3-force";
//import { transition } from "d3-transition";

export class Egograph extends ForceDirectedGraph {

	private _centralNode: Node;
	private _curGraph: Graph;
	private _curTimestep: number;
	private _neighboringNodesMap: Map<number, Node>;
	private _incidentEdgesMap: Map<[number | string, number], Edge>;
	private _neighboringNodes: Array<Node>;
	private _centralNodeArray: Array<Node>;
	private _incidentEdges: Array<Edge>;

	set centralNode(n: Node) {
		this._centralNode = n;
	}

	constructor(centralNode: Node, dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>,
		width: number, height: number) {
		super(dynamicGraph, location);
		this._centralNode = centralNode;
		this._curTimestep = 0;
		this._centralNodeArray = [];
		this._curGraph = super.graph.timesteps[this._curTimestep];
		this._incidentEdges = [];
		this._neighboringNodes = [];
		this._incidentEdgesMap = new Map<[number | string, number], Edge>();
		this._neighboringNodesMap = new Map();
		this.realInit();
		this.init();
	}

	private realInit() {
		console.log("realinit");
		this.graph.timesteps.forEach(function (step: Graph) {
			step.edges.forEach(function (e: DrawableEdge) {
				e.origSource = e.source;
				e.origTarget = e.target;
			})
		})
	}


	//this function fills the _incidentEdge array with all of the edges that touch the central node
	//through every timestep. It must be called before calling getNeighboringNodes.
	private processNodesAndEdges() {
		console.log("processing");
		this.getCentralNodes();
		let steps = super.graph.timesteps;
		for (let step of steps) {
			for (let edge of step.edges as DrawableEdge[]) {
				//edge.target.id === this._centralNode.id || edge.source.id === this._centralNode.id
				if (this._centralNodeArray.includes(edge.origTarget) || this._centralNodeArray.includes(edge.origSource)) {

					if (this._centralNodeArray.includes(edge.origTarget)) {
						if (this._neighboringNodesMap.has(edge.origSource.id as number)) {
							edge.source = this._neighboringNodesMap.get(edge.origSource.id as number)
						} else {
							this._neighboringNodesMap.set(edge.origSource.id as number, edge.origSource);
							edge.source = this._neighboringNodesMap.get(edge.origSource.id as number);
						}
					}
					if (this._centralNodeArray.includes(edge.origSource)) {
						if (this._neighboringNodesMap.has(edge.origTarget.id as number)) {
							edge.target = this._neighboringNodesMap.get(edge.origTarget.id as number);
						} else {
							this._neighboringNodesMap.set(edge.origTarget.id as number, edge.origTarget);
							edge.target = this._neighboringNodesMap.get(edge.origTarget.id as number);
						}
					}
					this._incidentEdgesMap.set([edge.id as number | string, step.timestep], edge);
				}
			}
		}

		this.edgeMapToEdgeArray();
		this.nodeMapToNodeArray();
		this.mergeNodeLists();
		// console.log(this._incidentEdges);
		// console.log(this._neighboringNodes);
	}

	private getCentralNodes() {
		let steps = super.graph.timesteps;
		for (let n of steps) {
			for (let m of n.nodes) {
				if ((m.id as number) === this._centralNode.id) {
					this._centralNodeArray.push(m);
				}
			}
		}
	}


	private clickTransition(self: Egograph) {
		let ego = this;
		return function (d: Node, i: number) {
			ego.emptyArray();
			ego.clearMap();
			ego._centralNode = d;
			ego.init();
		}
	}

	protected clickListen() {
		this.nodeGlyphs.on("click", this.clickTransition(this));
	}

	public init() {
		this.processNodesAndEdges();
		//this.getNeighboringNodes();
		let g: Graph = new Graph(this._neighboringNodes, this._incidentEdges, this._curTimestep);
		this.initSimulation();
		super.draw(g);
		this.clickListen(); //should only need to happen once
	}

	private mergeNodeLists() {
		for (let n of this._centralNodeArray) {
			this._neighboringNodes.push(n);
		}
	}
	get incidentEdges() {
		return this._incidentEdges;
	}
	get neighboringNodes() {
		return this._neighboringNodes;
	}

	private edgeMapToEdgeArray() {
		for (let key of this._incidentEdgesMap.keys()) {
			this._incidentEdges.push(this._incidentEdgesMap.get(key));
		}
	}
	private nodeMapToNodeArray() {
		for (let key of this._neighboringNodesMap.keys()) {
			this._neighboringNodes.push(this._neighboringNodesMap.get(key));
		}
	}


	//Clears both the neihboringNodesMap and the incidentEdgesMap
	private clearMap() {
		this._neighboringNodesMap.clear();
		this._incidentEdgesMap.clear();
	}
	//Clears the incidentEdges, neighboringNodes, and centralNode arrays
	private emptyArray() {
		this._centralNodeArray = [];
		this._incidentEdges = [];
		this._neighboringNodes = [];
	}

	// 					WORKS

	protected drawLinks(edges: Edge[]) { //does what it says on the tin
		super.drawLinks(edges);
		this.linkGlyphs.attr("source", function (d: Edge) {
			return d.source.id;
		})
		this.linkGlyphs.attr("target", function (d: Edge) {
			return d.target.id;
		})
	}

	protected drawNodes(nodes: Node[]) { //does what it says on the tin
		super.drawNodes(nodes);
		this.nodeGlyphs.attr("id", function (d: Node) {
			return d.id;
		});
	}

	protected initSimulation() {
		let yScale = d3Scale.scaleLinear()
			.domain([0, super.graph.timesteps.length])
			.range([0 + (super._height * .25), super._height - (super.height * 0.25)]);
		let centralNodes = this._centralNodeArray;
		let ego = this;
		super.initSimulation();
		this.simulation
			.force("alignCentralNodesY", d3force.forceY(function (d: Node) {
				if (centralNodes.includes(d)) {
					return 1;
				}
				return 0.5;
			}).strength(function (d: Node) {
				if (centralNodes.includes(d)) {
					return 0.5
				}
				return 0;
			})
			)
	}

}



