import { Node, Edge, Graph, DynamicGraph } from "./Graph"
import { ForceDirectedGraph } from "./ForceDirectedGraph"
import { Selection } from "d3-selection";
import * as d3 from "d3-selection";
//import { transition } from "d3-transition";

export class Egograph extends ForceDirectedGraph {

	private _centralNode: Node;
	private _curGraph: Graph;
	private _curTimestep: number;
	private _neighboringNodesMap: Map<number, Node>;
	private _incidentEdgesMap: Map<number, Edge>;
	private _neighboringNodes: Array<Node>;
	private _incidentEdges: Array<Edge>;

	constructor(centralNode: Node, dynamicGraph: DynamicGraph, location: Selection<any, {}, any, {}>,
		width: number, height: number) {
		super(dynamicGraph, location);
		this._centralNode = centralNode;
		this._curTimestep = 0;
		this._curGraph = super.graph.timesteps[this._curTimestep];
		this._incidentEdges = [];
		this._neighboringNodes = [];
		this._incidentEdgesMap = new Map();
		this._neighboringNodesMap = new Map();
		this.init();
	}


	//this function fills the _incidentEdge array with all of the edges that touch the central node
	//through every timestep. It must be called before calling getNeighboringNodes.
	private getIncidentEdges() {
		let steps = super.graph.timesteps;
		for (let k of steps) {
			for (let n of k.edges) {
				if (n.target.id === this._centralNode.id || n.source.id === this._centralNode.id) {
					this._incidentEdgesMap.set(n.id as number, n);
				}
			}
		}
		this.edgeMapToEdgeArray();
		console.log(this._incidentEdges);
	}

	//this function creates a mapping of every node that ever shares an edge with the central
	//node. The function must be called after calling getIncidentEdges(), as this function
	//relies on having a list of edges to determine which nodes touch the central node.
	private getNeighboringNodes() {
		let steps = super.graph.timesteps;
		for (let k of steps) {
			for (let n of k.nodes) {
				for (let m of this._incidentEdges) {
					if (n.id !== this._centralNode.id && (m.source.id === n.id || m.target.id === n.id)) {
						this._neighboringNodesMap.set(n.id as number, n);
					}
				}
			}
			this._neighboringNodesMap.set(this._centralNode.id as number, this._centralNode);
		}
		this.nodeMapToNodeArray();
		console.log(this._neighboringNodes);
	}


	private clickTransition(self: Egograph) {
		let graph = this;
		return function (d: Node, i: number) {
			graph.emptyArray();
			graph.clearMap();
			graph._centralNode = d;
			graph.init();
		}
	}

	protected clickListen() {
		this.nodeGlyphs.on("click", this.clickTransition(this));
	}

	public init() {
		this.getIncidentEdges();
		this.getNeighboringNodes();
		let g: Graph = new Graph(this._neighboringNodes, this._incidentEdges);
		super.draw(g);
		this.clickListen();
	}

	private setCentralNode(node: Node) {
		this._centralNode = node;
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


	get incidentEdges() {
		return this._incidentEdges;
	}
	get neighboringNodes() {
		return this._neighboringNodes;
	}
}